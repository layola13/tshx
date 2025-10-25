package haxetransforms

import (
	"github.com/microsoft/typescript-go/internal/transformers"
)

// HaxeTransformer chains all Haxe-specific syntax transformers
var NewHaxeTransformer = transformers.Chain(
	newRangeTransformer,
	newADTEnumTransformer,
)

// GetHaxeTransformer returns the Haxe transformer chain
func GetHaxeTransformer(opts *transformers.TransformOptions) *transformers.Transformer {
	return NewHaxeTransformer(opts)
}