---
waltz:
  title: EGDD Example - Index the Cat
meta:
  version: 0.0.3
  gdd authors:
    - Austin Cory Bart <acbart@udel.edu>
  template authors:
    - Austin Cory Bart <acbart@udel.edu>
    - Mark Sheriff
    - Alec Markarian
    - Benjamin Stanley
---

# Index the Cat

# Overview

## Elevator Pitch

You have this cute, long Munchkin cat that you want to pet. However, you can only pet and scratch certain parts of the cat, or it will get mad. Each part of the cat is labeled with some data. To know which parts are safe, you need to interpret Python list indices and subscripts.

## Influences (Brief)

- WarioWare Minigame:
  - Medium: Game
  - Explanation: The WarioWare minigames are short little experiences. This game has a similar "small" feel to it.
- Cat Collector:
  - Medium: Android phone game
  - Explanation: Cat Collector is a simple little game where you can get cute cats. This game tries to appeal to the same kind of audience with its adorable cat that you can interact with.

## Core Gameplay Mechanics (Brief)

- Pet the cat by dragging the pointer across multiple numbers
- Scratch the cat by clicking a single number
- Incorrectly petting/scratching the cat will cause it to hiss angrily and move to the next round
- Whenever you pet or scratch the cat, it advances to a new round and the cat purrs happily
- Correctly pet/scratch the cat 4 times to advance to the next level
- After you complete all the levels, it displays a victory message.

# Learning Aspects

## Learning Domains

Introductory Python programming

## Target Audiences

* Novice programmers with a little prior programming knowledge.
* Should be appropriate for younger kids and adults who are young at heart.

## Target Contexts

* This would be assigned as supplementary practice in a course formally teaching introductory Python programming.
* Due to the use of audio, it might not be appropriate for a classroom activity

## Learning Objectives

*Remember, Learning Objectives are NOT simply topics. They are statements of observable behavior that a learner can do after the learning experience. You cannot observe someone "understanding" or "knowing" something.*

- By the end of the lesson, players will be able to identify the location of a legitimate index in a list, both positive and negatives.
- By the end of the lesson, players will be able to identify that an index is not available in a list.
- By the end of the lesson, players will be able to identify the locations of a subscript in a list, both positive, negatives, and missing.

## Prerequisite Knowledge

*What do they need to know prior to trying this game?*

- Prior to the game, players need to be able to define the concept of a Python list.
- Prior to the game, players need to be able to explain the purpose of a Python list.
- Prior to the game, players need to be able to express the ordered elements of a Python list.

## Assessment Measures

A short pre-test and matching post-test should be designed to assess student learning.

- Given a list stored in a variable, identify the length of the list.
- Given a list stored in a variable and an index, identify the value at that position.
- Given a list stored in a variable and a subscript, identify the values at that position.

# What sets this project apart?

- Most introductory coding activities focus on code-writing, this can have a cute animal and graphics
- The gameplay mechanics of petting and scratching the cat connect to the desired goal of identifying indices and slices correctly

# Player Interaction Patterns and Modes

## Player Interaction Pattern

This is a game for one person, they click/drag with the mouse or touch on their screen.

## Player Modes

- Single-player: You repeatedly advance through rounds and levels until you reach the end.

# Gameplay Objectives

- Make the cat happy: When the cat is properly pet or scratched, it becomes happy and you get a point for the round.
- Advance to the next level: Get 4 rounds correct to advance to the next level
- Complete all the levels: Get through all the levels to win the game.

# Procedures/Actions

You can either click (scratch) or drag (pet) the mouse through regions of the screen.

Some of those regions are specifying locations in a row of numbers representing a Python list.

# Rules

- If the player clicks the wrong region, then the cat hisses
- If the player clicks the correct region, then the cat meows happily and a new index is selected.
- Randomly after every click, the list changes
- Over time, the range of indexes and subscripts evolve to incorporate the following
  - Positive indexes
  - Negative indexes
  - Invalid indexes
  - Positive to Positive subscript
  - Positive to Negative subscript
  - Negative to Positive subscript
  - Negative to Negative subscript
  - Negative to Negative subscript (will be empty)
  - Positive to Positive subscript (will be empty)
  - Empty to Positive subscript
  - Empty to Negative subscript
  - Positive to Empty subscript
  - Negative to Empty subscript
  - Empty to Empty subscript

# Objects/Entities

- There's a Munchkin cat with a variable length.
- There's a Python list superimposed on the cat.
- There's an Index or Subscript below the cat.
- There's some Python code above the cat.
- There's some instructions that appear periodically at the bottom of the screen.

## Core Gameplay Mechanics (Detailed)

- Petting/Scratching the Cat: You click on an index and drag the cursor to the right. You cannot drag it to the left of the starting point (since we only advance through indices, never go backward). You can move the cursor forward or backward as you aim your pet/scratch. When you release, the pet/scratch animation should occur. If you click on a single index, you are scratching the cat; if you highlight several indices, then you are petting the cat.
- Correctly interacting with cat: If you correctly pet/scratch the cat, it will purr happily and make its face happy. Then the game will advance to the next round, switching up the list and target index.
- Incorrectly interacting with cat: If you incorrectly pet/scratch the cat, it will hiss angrily and make its face unhappy. Then the game will change the list and target index.
- 4 Correct Interactions: If you pet the cat correctly 4 times more than you've incorrectly interacted with it, then the game will advance to the next level and change the kind of list and target index (e.g., making a bigger list, adding in subscripts, adding in negative indices).
- All levels complete: After you complete all the levels, it displays a victory message. The cat will be permenantly happy.
    
## Feedback

* Petting/Scratching the cat correctly makes it happy, which gives you positive or negative feedback about whether you got the question correct.
* Text on the screen indicates how many correct and incorrect interactions you have had this round.
* When you advance to a new level, the level text changes and an animation should play.
* When you win the game, the cat becomes happy.

# Story and Gameplay

## Presentation of Rules

* Text shown on the main game screen explains the objective and interaction instructions

## Presentation of Content

* The game does not attempt to teach you how to properly index and subscript a list. That is expected to be delivered with supplementary materials.

## Story (Brief)

You see a cute cat, you want to pet it, but you know that cats can only be pet in regions specified according to Python indexing rules.

# Assets Needed

## Aethestics

The aethestics should be happy and cartoonish. The game should have a light-hearted feel. This should encourage the player to feel okay with their mistakes even as they try to do better.

## Graphical

- Characters List
  - Cat: Needs to have a segmented body, a tail, and three kinds of faces (neutral, happy, and angry)
- Textures: N/A
- Environment Art/Textures:
  - Background: The background should be a please grassy hill with the sun shining.

## Audio


- Music List (Ambient sound)
  - General gameplay: light, idyllic music like the [Play a MiniGame! song from Mario Party 1](https://www.youtube.com/watch?v=UcfaaMwPtOQ)
  

- Sound List (SFX)
  - Cat angrily hissing sound: Recorded by Dr. Bart
  - Cat happily mewing sound: Recorded by Dr. Bart
