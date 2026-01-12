# Action Language Model and Execution Engine

This document captures the concepts, architecture, and implementation details of the Action Language Model and its associated Execution Engine, based on PhD research from 2010.

## Overview

The Action Language Model is a **tree-based semantic model** that describes the structure of block-structured computer programs or algorithms. It serves two primary purposes:

1. **Program Representation**: Capturing the semantic structure of algorithms in a language-agnostic way
2. **Adaptation Support**: Enabling description of differences between versions of algorithms (via the related Adaptation Model)

The model is designed to support **adaptive user interfaces** where algorithms may need to be modified based on context of use (e.g., user capability, timing requirements).

## Core Concepts

### The Action Language Model

The model represents programs as a **tree structure** where:

- Each node is an **Action** (an executable unit)
- Actions can contain child Actions (forming the tree)
- Actions have **types** (e.g., `seq`, `for`, `if`, `assignVar`)
- Actions can have **attributes** (e.g., variable names, literal values)
- Child Actions are **sequenced** (ordered within their parent)

### Key Model Entities

| Entity | Description |
|--------|-------------|
| **Action** | A node in the action tree; the basic executable unit |
| **ActionType** | Defines the kind of action (e.g., `seq`, `for`, `literal`, `add`) |
| **ActionColoring** | Links an Action to its ActionType |
| **ActionAttribute** | Holds attribute values for an Action (e.g., variable name, literal value) |
| **AttributeType** | Defines the type of attribute (e.g., `var.name`, `literal.number`) |
| **AttributeDataType** | Defines data types (e.g., `String`, `Integer`) |
| **SequencedAction** | Establishes parent-child relationships with sequence numbers |

### The Adaptation Model

The Adaptation Model works alongside the Action Language Model to describe:

- **Variations** between algorithm versions
- **Add/Modify/Delete** operations on Actions
- Changes in timing and sequencing for different contexts

Example modification:
```xml
<modifyAction refId="2" av="20" />
```
This would modify Action with id="2" to change its attribute value to "20".

## XML Representation

Programs are represented in XML that directly mirrors the Action tree structure. This makes:

- **Parsing trivial** (standard XML DOM parsing)
- **Compilation simple** (tree walking)
- **Decompilation straightforward** (tree traversal to XML generation)

### XML Structure

#### Type Definitions (Header)
```xml
<dataType name="String" />
<dataType name="Integer" />

<actionType name="seq" />
<actionType name="const" />
<actionType name="literal" />
<actionType name="var" />
<actionType name="for" />
<actionType name="lt" />
<actionType name="readVar" />
<actionType name="readConst" />
<actionType name="postInc" />
<actionType name="printVar" />
<actionType name="assignVar" />
<actionType name="add" />

<attributeType name="const.name" dataTypeName="String" />
<attributeType name="literal.number" dataTypeName="Integer" />
<attributeType name="var.name" dataTypeName="String" />
```

#### Program Body (Fibonacci Example)
```xml
<seq>
  <const at="const.name" av="maxCount">
    <literal at="literal.number" av="10" />
  </const>
  <var at="var.name" av="n-1">
    <literal at="literal.number" av="0" />
  </var>
  <var at="var.name" av="newFib">
    <literal at="literal.number" av="0" />
  </var>
  <var at="var.name" av="fib">
    <literal at="literal.number" av="1" />
  </var>
  <for>
    <var at="var.name" av="count">
      <literal at="literal.number" av="0" />
    </var>
    <lt>
      <readVar at="readVar.name" av="count" />
      <readConst at="readConst.name" av="maxCount" />
    </lt>
    <postInc at="postInc.name" av="count" />
    <seq>
      <printVar at="printVar.name" av="fib" />
      <assignVar at="assignVar.name" av="newFib">
        <add>
          <readVar at="readVar.name" av="n-1" />
          <readVar at="readVar.name" av="fib" />
        </add>
      </assignVar>
      <assignVar at="assignVar.name" av="n-1">
        <readVar at="readVar.name" av="fib" />
      </assignVar>
      <assignVar at="assignVar.name" av="fib">
        <readVar at="readVar.name" av="newFib" />
      </assignVar>
    </seq>
  </for>
</seq>
```

### XML Attributes

| Attribute | Description |
|-----------|-------------|
| `at` | Attribute Type - identifies what kind of attribute this is |
| `av` | Attribute Value - the actual value |
| `id` | Unique identifier for the Action (added during compilation) |
| `seqNum` | Sequence number within parent (for ordering) |
| `acId` | ActionColoring identifier |
| `attrId` | ActionAttribute identifier |

## Execution Engine Architecture

The execution engine operates directly on the Action Language Model without further compilation, similar to a **Threaded Interpreted Language (TIL)** like Forth.

### Key Characteristics

1. **Direct Model Execution**: Executes from the populated model, not compiled bytecode
2. **Multi-threaded Support**: Actions implement `Runnable` for parallel execution
3. **Stack-based**: Uses multiple stacks for scope management
4. **Both Strongly and Weakly Typed**: Supports both paradigms

### Stack Architecture

The engine maintains multiple stacks for different purposes:

| Stack | Purpose |
|-------|---------|
| **ConstantStack** | Stores declared constants |
| **VariableStack** | Stores declared variables |
| **ListStack** | Stores list data structures |
| **ArrayStack** | Stores array data structures |
| **ObjectStack** | Stores object instances |
| **CallingContextStack** | Manages calling contexts |
| **InterfaceStack** | Stores interface definitions |
| **AliasStack** | Manages type/name aliases |
| **FunctionStack** | Stores function declarations |
| **DataTypeStack** | Stores data type definitions |

### Stack Linking for Scope

Stacks can be:
- **Linked**: New stack linked to parent for block scoping (variables visible down the chain)
- **Separate**: Completely isolated stack for sandboxing (e.g., untrusted code)

When a block terminates, its stack is unlinked, implementing proper variable scoping.

## Action Classes

All Actions inherit from a base `Action` class and implement execution logic.

### Base Action Pattern

```java
public class SomeAction extends Expression {
    // Attributes specific to this action type

    @Override
    public Object execute(
        ConstantStack constantStack,
        VariableStack variableStack,
        ListStack listStack,
        ArrayStack arrayStack,
        ObjectStack objectStack,
        CallingContextStack callingContextStack,
        InterfaceStack interfaceStack,
        AliasStack aliasStack,
        FunctionStack functionStack,
        DataTypeStack dataTypeStack
    ) {
        super.execute(...);
        // Action-specific execution logic
        return result;
    }
}
```

### Core Action Types

#### Control Flow
| Action | Description |
|--------|-------------|
| `Seq` | Sequential execution of child actions |
| `For` | For loop (init, condition, increment, body) |
| `While` | While loop |
| `If` / `IfElse` | Conditional execution |
| `Try` / `Catch` | Exception handling |

#### Variables and Constants
| Action | Description |
|--------|-------------|
| `DeclareVariable` | Declare a variable with initial value |
| `DeclareConstant` | Declare a constant |
| `AssignVariable` | Assign value to existing variable |
| `ReadVariable` | Read variable value |
| `ReadConstant` | Read constant value |

#### Expressions and Operators
| Action | Description |
|--------|-------------|
| `Literal` | Literal value (number, string, etc.) |
| `Add`, `Subtract`, `Multiply`, `Divide` | Arithmetic |
| `Lt`, `Gt`, `Eq`, `Ne` | Comparison |
| `And`, `Or`, `Not` | Logical |
| `BitwiseAnd`, `BitwiseOr`, `BitwiseXOR` | Bitwise |
| `PostInc`, `PostDec` | Increment/Decrement |

#### Functions
| Action | Description |
|--------|-------------|
| `DeclareFunction` | Declare a function with parameters and body |
| `CallWeaklyTypedFunctionByName` | Call function (weak typing) |
| `CallStronglyTypedFunctionByName` | Call function (strong typing) |
| `DeclareParameter` | Declare function parameter |
| `Return` | Return value from function |

#### I/O
| Action | Description |
|--------|-------------|
| `PrintVariable` | Output variable value |
| `Print` | Output expression value |

## Data Type System

### Supported Core Types

```java
public enum SupportedContentTypes {
    Action,
    Integer,
    Double,
    String,
    Boolean,
    Character,
    Object,
    Iterator,
    Typeless  // For weakly typed data
}
```

### Type Implementation Pattern

Each data type has:
1. **DataTypeInstance** class - holds values and implements operators
2. **Declare** action - creates typed variables

Example operators for Integer:
- Arithmetic: `add`, `subtract`, `multiply`, `divide`
- Comparison: `eq`, `ne`, `gt`, `lt`, `gtEq`, `ltEq`
- Bitwise: `bitwiseAnd`, `bitwiseOr`, `bitwiseXOR`, `bitwiseNot`
- Shift: `shiftLeft`, `shiftRightWithSign`, `shiftRightWithZeroFill`

## Object-Oriented Support

The engine supports object-oriented paradigms including:

- **Classes** with attributes and methods
- **Inheritance** (including multiple inheritance for C++ compatibility)
- **Visibility modifiers** (public, private, protected)
- **Strongly and weakly typed** attributes and parameters

### Attribute Declaration

```java
public class DeclareStronglyTypedAttribute extends DeclareAttribute {
    public Expression defaultValue;  // Defines type via first assignment

    @Override
    public Object execute(...) {
        Object val = this.defaultValue.execute(...);
        return new EngineAttributeStronglyTyped(
            finalizedModifier,
            visibilityModifier,
            attributeName,
            val
        );
    }
}
```

## Compilation and Decompilation

### Compilation Process

1. Parse XML to create DOM
2. Walk DOM recursively via `populate()` method
3. For each node:
   - If `dataType`: populate AttributeDataType
   - If `actionType`: populate ActionType
   - If `attributeType`: populate AttributeType
   - Otherwise: populate Action, ActionColoring, ActionAttribute, SequencedAction
4. Recurse into child nodes

### Decompilation Process

1. Generate AttributeDataType entries as `<dataType>` elements
2. Generate ActionType entries as `<actionType>` elements
3. Generate AttributeType entries as `<attributeType>` elements
4. Recursively generate Action tree as nested XML elements

## Code Generation

The engine supports generating code in different target languages:

### XML Generation
```java
public void generateXML(int treeDepth) {
    // Output XML element with attributes
    // Recurse into children
}
```

### JavaScript Generation
```java
public void generateJavascript(int treeDepth, boolean startOnNewline) {
    // Output JavaScript syntax
    // Recurse into children
}
```

## Security Considerations

The stack architecture enables **sandboxing** of untrusted code:

- Separate stacks isolate execution contexts
- Specialized versions of `Seq` can restrict available actions
- Example: Remove reflection from Java-like languages to prevent security bypasses

## Future Implementation: JavaScript

The goal is to implement this model using **JavaScript as the model language**, enabling:

1. **Parsing** JavaScript code into the Action Language Model
2. **Executing** directly from the model
3. **Generating** ActionScript (XML) from JavaScript
4. **Translating** any JavaScript fragment into the model representation

This will require:
- JavaScript parser to build the Action tree
- Mapping of JavaScript constructs to Action types
- Execution engine implementation in JavaScript
- XML serialization/deserialization

## Summary

The Action Language Model provides:

1. **Language-agnostic** representation of program semantics
2. **Tree-based** structure that's easy to manipulate
3. **Adaptation support** for describing algorithm variations
4. **Direct execution** without intermediate compilation
5. **Multi-paradigm** support (procedural, OO, strongly/weakly typed)
6. **Sandboxing** capabilities for security

The model separates the **what** (semantic structure) from the **how** (syntax), enabling programs to be represented, modified, and executed independently of their source language.
