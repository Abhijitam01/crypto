// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @dev Library for managing counters.
 *
 * Counters are useful for tracking numbers like the number of elements in a mapping, issuing ERC721 IDs, or tracking request IDs.
 *
 * This library provides a struct `Counter` and three functions: `current`, `increment`, and `decrement`.
 * 
 * This version prevents underflow and does not allow a counter to be decremented below zero.
 */
library Counters {
    struct Counter {
        uint256 _value; // default: 0
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    function decrement(Counter storage counter) internal {
        uint256 value = counter._value;
        require(value > 0, "Counter: decrement below zero");
        unchecked {
            counter._value -= 1;
        }
    }

    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
}
