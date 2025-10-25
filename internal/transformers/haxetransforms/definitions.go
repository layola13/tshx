package haxetransforms

import (
	"github.com/microsoft/typescript-go/internal/transformers"
)

// HaxeTransformer chains all Haxe-specific syntax transformers
var NewHaxeTransformer = transformers.Chain(
	newHaxeTypesTransformer,       // Transform Haxe types (Int/Float/Bool/Dynamic) to TS types
	newRangeTransformer,           // Transform range expressions to for loops
	newADTEnumTransformer,         // Transform ADT enums
	newSwitchPatternTransformer,   // Transform switch pattern matching with ADT enums
	newPropertyAccessorTransformer, // Transform Haxe-style property accessors to getter/setter
)

// GetHaxeTransformer returns the Haxe transformer chain
func GetHaxeTransformer(opts *transformers.TransformOptions) *transformers.Transformer {
	return NewHaxeTransformer(opts)
}