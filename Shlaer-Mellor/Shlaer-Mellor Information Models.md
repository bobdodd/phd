# Shlaer-Mellor Information Models

This document describes the notation used in Shlaer-Mellor Information Models, a method for object-oriented analysis developed by Sally Shlaer and Stephen Mellor in the late 1980s.

## Overview

Shlaer-Mellor Information Models represent the static structure of a system, showing objects (entities) and their relationships. The notation uses specific symbols to convey cardinality, relationship types, and inheritance.

## Basic Elements

### Objects (Entities)

Objects are represented as **rectangles** containing the object name. These represent the key entities or concepts in the domain being modeled.

```
+------------------+
|     Object       |
+------------------+
```

## Relationship Notation

### Cardinality (Multiplicity)

Cardinality is indicated by **arrowheads** at the ends of relationship lines:

| Symbol | Meaning |
|--------|---------|
| Single arrowhead (`>`) | "One" (1) side of the relationship |
| Double arrowhead (`>>`) | "Many" (M) side of the relationship |

#### Examples:

**1:M Relationship** (One-to-Many):
```
+--------+                    +--------+
| Object | --------------->> | Object |
|   A    |                    |   B    |
+--------+                    +--------+
```
Object A relates to many Object Bs.

**M:M Relationship** (Many-to-Many):
```
+--------+                    +--------+
| Object | <<-------------->> | Object |
|   A    |                    |   B    |
+--------+                    +--------+
```
Many Object As relate to many Object Bs.

**1:1 Relationship** (One-to-One):
```
+--------+                    +--------+
| Object | >--------------< | Object |
|   A    |                    |   B    |
+--------+                    +--------+
```
One Object A relates to one Object B (bidirectional).

### "Has A" Relationship (Composition/Aggregation)

A **diamond** symbol indicates a "has a" relationship, showing that one object contains or owns another.

```
+--------+                    +--------+
| Part   | ----------------<> | Whole  |
+--------+                    +--------+
```

The diamond appears at the "whole" end - the object that contains/owns the other.

Example from the Dexter Model:
- Component has Attributes (diamond at Component)
- Component has Presentation Specification (diamond at Component)

### "Is A" Relationship (Inheritance/Generalization)

Inheritance is shown with:
1. **No arrowheads** on the relationship lines
2. A **short perpendicular line** crossing the line segment that connects to the parent (supertype)

```
                    +----------+
                    |  Parent  |
                    +----------+
                         |
                        -+-  <-- perpendicular mark indicates parent
                         |
          +--------------+---------------+
          |              |               |
     +--------+     +--------+     +--------+
     | Child1 |     | Child2 |     | Child3 |
     +--------+     +--------+     +--------+
```

The perpendicular crossing line identifies which object is the parent/supertype in the inheritance hierarchy.

### Associative Relationships

When a relationship line's **arrowhead terminates in the middle of another line** (rather than at an object), this represents an associative relationship. The cardinality (1 or M) is still indicated by the number of arrowheads.

## Specific Cardinality Labels

When a relationship has a specific numeric cardinality (not just "one" or "many"), this can be indicated with a number label near the arrowhead.

Example:
```
+--------+           2        +--------+
|  Arc   | ---------------->> |Arc End |
+--------+                    +--------+
```
This indicates that each Arc has exactly 2 Arc Ends.

## Self-Referential Relationships

Objects can have relationships with themselves, shown as loops:

```
     +--<---+
     |      |
+--------+  |
| Object |--+
+--------+
```

The arrowheads still indicate cardinality. For example, a Composite Component can contain multiple Components (including other Composites).

## Summary of Symbols

| Symbol | Meaning |
|--------|---------|
| Rectangle | Object/Entity |
| Single arrowhead | "One" (1) cardinality |
| Double arrowhead | "Many" (M) cardinality |
| Diamond | "Has a" (composition/aggregation) |
| Perpendicular crossing line | Parent in "is a" (inheritance) relationship |
| No arrowheads | Inheritance relationship line |
| Arrow terminating on line | Associative relationship |
| Numeric label | Specific cardinality (e.g., "2") |

## References

- Shlaer, S., & Mellor, S. J. (1988). *Object-Oriented Systems Analysis: Modeling the World in Data*. Yourdon Press.
- Shlaer, S., & Mellor, S. J. (1992). *Object Lifecycles: Modeling the World in States*. Yourdon Press.

## Notes

This notation was used in the recreation of the Dexter Hypertext Reference Model diagram, which illustrates the structure of hypertext systems including Components, Anchors, Links, and their relationships.
