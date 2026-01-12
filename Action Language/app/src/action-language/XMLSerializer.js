/**
 * XMLSerializer - Converts between ActionLanguage trees and XML representation
 *
 * XML Format follows the structure defined in the original Action Language Model:
 * - Type definitions: <dataType>, <actionType>, <attributeType>
 * - Actions: Elements named by their actionType
 * - Attributes: 'at' (attribute type) and 'av' (attribute value)
 * - Children: Nested elements
 */

const Action = require('./Action');
const ActionTree = require('./ActionTree');

class XMLSerializer {
  /**
   * Serialize an ActionTree to XML string
   * @param {ActionTree} tree - The tree to serialize
   * @param {Object} [options] - Serialization options
   * @param {number} [options.indent=2] - Indentation spaces
   * @param {boolean} [options.includeIds=true] - Include action IDs
   * @param {boolean} [options.includeSeqNums=true] - Include sequence numbers
   * @returns {string} XML string
   */
  static serialize(tree, options = {}) {
    const {
      indent = 2,
      includeIds = true,
      includeSeqNums = true
    } = options;

    const lines = [];
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push('<actionLanguage>');

    // Metadata
    lines.push(`${' '.repeat(indent)}<metadata>`);
    lines.push(`${' '.repeat(indent * 2)}<version>${XMLSerializer.escapeXml(tree.metadata.version)}</version>`);
    lines.push(`${' '.repeat(indent * 2)}<created>${XMLSerializer.escapeXml(tree.metadata.created)}</created>`);
    lines.push(`${' '.repeat(indent * 2)}<modified>${XMLSerializer.escapeXml(tree.metadata.modified)}</modified>`);
    if (tree.metadata.source) {
      lines.push(`${' '.repeat(indent * 2)}<source>${XMLSerializer.escapeXml(tree.metadata.source)}</source>`);
    }
    lines.push(`${' '.repeat(indent)}</metadata>`);

    // Data types
    lines.push(`${' '.repeat(indent)}<dataTypes>`);
    for (const dataType of tree.dataTypes) {
      lines.push(`${' '.repeat(indent * 2)}<dataType name="${XMLSerializer.escapeXml(dataType)}" />`);
    }
    lines.push(`${' '.repeat(indent)}</dataTypes>`);

    // Action types
    lines.push(`${' '.repeat(indent)}<actionTypes>`);
    for (const actionType of tree.actionTypes) {
      lines.push(`${' '.repeat(indent * 2)}<actionType name="${XMLSerializer.escapeXml(actionType)}" />`);
    }
    lines.push(`${' '.repeat(indent)}</actionTypes>`);

    // Attribute types
    lines.push(`${' '.repeat(indent)}<attributeTypes>`);
    for (const [name, info] of tree.attributeTypes) {
      lines.push(`${' '.repeat(indent * 2)}<attributeType name="${XMLSerializer.escapeXml(name)}" dataTypeName="${XMLSerializer.escapeXml(info.dataType)}" />`);
    }
    lines.push(`${' '.repeat(indent)}</attributeTypes>`);

    // Program (action tree)
    lines.push(`${' '.repeat(indent)}<program>`);
    if (tree.root) {
      XMLSerializer.serializeAction(tree.root, lines, indent * 2, indent, includeIds, includeSeqNums);
    }
    lines.push(`${' '.repeat(indent)}</program>`);

    lines.push('</actionLanguage>');

    return lines.join('\n');
  }

  /**
   * Serialize a single action and its children
   * @private
   */
  static serializeAction(action, lines, currentIndent, indentSize, includeIds, includeSeqNums) {
    const padding = ' '.repeat(currentIndent);
    const tagName = XMLSerializer.escapeXml(action.actionType);

    // Build attributes string
    let attrs = '';
    if (includeIds) {
      attrs += ` id="${XMLSerializer.escapeXml(action.id)}"`;
    }
    if (includeSeqNums && action.sequenceNumber !== 0) {
      attrs += ` seqNum="${action.sequenceNumber}"`;
    }

    // Add action's own attributes (at/av format)
    for (const [key, value] of action.attributes) {
      const escapedKey = XMLSerializer.escapeXml(key);
      const escapedValue = XMLSerializer.escapeXml(String(value));
      attrs += ` at="${escapedKey}" av="${escapedValue}"`;
    }

    if (action.children.length === 0) {
      // Self-closing tag for leaf nodes
      lines.push(`${padding}<${tagName}${attrs} />`);
    } else {
      // Opening tag
      lines.push(`${padding}<${tagName}${attrs}>`);

      // Serialize children
      for (const child of action.children) {
        XMLSerializer.serializeAction(child, lines, currentIndent + indentSize, indentSize, includeIds, includeSeqNums);
      }

      // Closing tag
      lines.push(`${padding}</${tagName}>`);
    }
  }

  /**
   * Deserialize XML string to ActionTree
   * @param {string} xml - The XML string
   * @returns {ActionTree}
   */
  static deserialize(xml) {
    // Simple XML parser (for browser/Node compatibility without external deps)
    const tree = new ActionTree();

    // Parse metadata
    const versionMatch = xml.match(/<version>([^<]*)<\/version>/);
    if (versionMatch) tree.metadata.version = versionMatch[1];

    const createdMatch = xml.match(/<created>([^<]*)<\/created>/);
    if (createdMatch) tree.metadata.created = createdMatch[1];

    const modifiedMatch = xml.match(/<modified>([^<]*)<\/modified>/);
    if (modifiedMatch) tree.metadata.modified = modifiedMatch[1];

    const sourceMatch = xml.match(/<source>([^<]*)<\/source>/);
    if (sourceMatch) tree.metadata.source = sourceMatch[1];

    // Parse data types
    const dataTypeRegex = /<dataType\s+name="([^"]+)"\s*\/>/g;
    let match;
    while ((match = dataTypeRegex.exec(xml)) !== null) {
      tree.registerDataType(XMLSerializer.unescapeXml(match[1]));
    }

    // Parse action types
    const actionTypeRegex = /<actionType\s+name="([^"]+)"\s*\/>/g;
    while ((match = actionTypeRegex.exec(xml)) !== null) {
      tree.registerActionType(XMLSerializer.unescapeXml(match[1]));
    }

    // Parse attribute types
    const attrTypeRegex = /<attributeType\s+name="([^"]+)"\s+dataTypeName="([^"]+)"\s*\/>/g;
    while ((match = attrTypeRegex.exec(xml)) !== null) {
      tree.registerAttributeType(
        XMLSerializer.unescapeXml(match[1]),
        XMLSerializer.unescapeXml(match[2])
      );
    }

    // Parse program/actions
    const programMatch = xml.match(/<program>([\s\S]*)<\/program>/);
    if (programMatch) {
      const programContent = programMatch[1].trim();
      if (programContent) {
        tree.root = XMLSerializer.parseActionElement(programContent);
      }
    }

    return tree;
  }

  /**
   * Parse an action element from XML string
   * @private
   */
  static parseActionElement(xml) {
    xml = xml.trim();
    if (!xml) return null;

    // Match opening tag with attributes
    const openTagMatch = xml.match(/^<(\w+)((?:\s+[^>]*)?)\s*(\/?)>/);
    if (!openTagMatch) return null;

    const tagName = openTagMatch[1];
    const attrsString = openTagMatch[2] || '';
    const selfClosing = openTagMatch[3] === '/';

    // Parse attributes
    const attributes = {};
    let actionId = null;
    let seqNum = 0;

    // Parse id attribute
    const idMatch = attrsString.match(/\bid="([^"]+)"/);
    if (idMatch) actionId = XMLSerializer.unescapeXml(idMatch[1]);

    // Parse seqNum attribute
    const seqMatch = attrsString.match(/\bseqNum="([^"]+)"/);
    if (seqMatch) seqNum = parseInt(seqMatch[1], 10);

    // Parse at/av attributes
    const atMatch = attrsString.match(/\bat="([^"]+)"/);
    const avMatch = attrsString.match(/\bav="([^"]+)"/);
    if (atMatch && avMatch) {
      attributes[XMLSerializer.unescapeXml(atMatch[1])] = XMLSerializer.unescapeXml(avMatch[1]);
    }

    // Create action
    const action = new Action(tagName, attributes);
    if (actionId) action.id = actionId;
    action.sequenceNumber = seqNum;

    // If not self-closing, parse children
    if (!selfClosing) {
      const closingTag = `</${tagName}>`;
      const closingIndex = xml.lastIndexOf(closingTag);

      if (closingIndex > -1) {
        const innerContent = xml.substring(openTagMatch[0].length, closingIndex).trim();
        const children = XMLSerializer.parseChildElements(innerContent);

        for (const child of children) {
          action.addChild(child, child.sequenceNumber);
        }
      }
    }

    return action;
  }

  /**
   * Parse multiple sibling elements
   * @private
   */
  static parseChildElements(xml) {
    const children = [];
    xml = xml.trim();

    while (xml.length > 0) {
      // Find the next element
      const openTagMatch = xml.match(/^<(\w+)((?:\s+[^>]*)?)\s*(\/?)>/);
      if (!openTagMatch) break;

      const tagName = openTagMatch[1];
      const selfClosing = openTagMatch[3] === '/';

      let elementEnd;
      if (selfClosing) {
        elementEnd = openTagMatch[0].length;
      } else {
        // Find matching closing tag (handling nesting)
        elementEnd = XMLSerializer.findClosingTag(xml, tagName);
      }

      if (elementEnd === -1) break;

      const elementXml = xml.substring(0, elementEnd);
      const child = XMLSerializer.parseActionElement(elementXml);
      if (child) {
        children.push(child);
      }

      xml = xml.substring(elementEnd).trim();
    }

    return children;
  }

  /**
   * Find the position after the closing tag, handling nested tags
   * @private
   */
  static findClosingTag(xml, tagName) {
    let depth = 0;
    let pos = 0;
    const openPattern = new RegExp(`<${tagName}(?:\\s[^>]*)?>`, 'g');
    const closePattern = new RegExp(`</${tagName}>`, 'g');
    const selfClosePattern = new RegExp(`<${tagName}(?:\\s[^>]*)?\\/>`,'g');

    // Simple state machine to track depth
    while (pos < xml.length) {
      // Check for self-closing at current position
      selfClosePattern.lastIndex = pos;
      const selfCloseMatch = selfClosePattern.exec(xml);
      if (selfCloseMatch && selfCloseMatch.index === pos) {
        if (depth === 0) {
          return pos + selfCloseMatch[0].length;
        }
        pos = selfClosePattern.lastIndex;
        continue;
      }

      // Check for opening tag
      openPattern.lastIndex = pos;
      const openMatch = openPattern.exec(xml);

      // Check for closing tag
      closePattern.lastIndex = pos;
      const closeMatch = closePattern.exec(xml);

      if (!openMatch && !closeMatch) break;

      // Determine which comes first
      const openPos = openMatch ? openMatch.index : Infinity;
      const closePos = closeMatch ? closeMatch.index : Infinity;

      if (openPos < closePos) {
        depth++;
        pos = openPos + openMatch[0].length;
      } else {
        depth--;
        if (depth === 0) {
          return closePos + closeMatch[0].length;
        }
        pos = closePos + closeMatch[0].length;
      }
    }

    return -1;
  }

  /**
   * Escape special XML characters
   * @param {string} str
   * @returns {string}
   */
  static escapeXml(str) {
    if (typeof str !== 'string') str = String(str);
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Unescape XML entities
   * @param {string} str
   * @returns {string}
   */
  static unescapeXml(str) {
    return str
      .replace(/&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/&amp;/g, '&');
  }
}

module.exports = XMLSerializer;
