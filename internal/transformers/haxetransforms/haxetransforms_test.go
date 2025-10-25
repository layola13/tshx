package haxetransforms_test

import (
	"testing"

	"github.com/microsoft/typescript-go/internal/binder"
	"github.com/microsoft/typescript-go/internal/core"
	"github.com/microsoft/typescript-go/internal/printer"
	"github.com/microsoft/typescript-go/internal/testutil/emittestutil"
	"github.com/microsoft/typescript-go/internal/testutil/parsetestutil"
	"github.com/microsoft/typescript-go/internal/transformers"
	"github.com/microsoft/typescript-go/internal/transformers/haxetransforms"
)

// TestRangeIterationTransformer tests the Haxe-style range iteration syntax (for i in 0...10)
// This feature is fully implemented and working
func TestRangeIterationTransformer(t *testing.T) {
	t.Parallel()
	data := []struct {
		title  string
		input  string
		output string
	}{
		{
			title: "simple exclusive range",
			input: "for (let i in 0...10) { console.log(i); }",
			output: `for (let i = 0; i < 10; i++) {
    console.log(i);
}`,
		},
		{
			title: "range with stepBy",
			input: "for (let i in (0...10).stepBy(2)) { console.log(i); }",
			output: `for (let i = 0; i < 10; i += 2) {
    console.log(i);
}`,
		},
		{
			title: "range with stepBy 5",
			input: "for (let i in (0...20).stepBy(5)) { console.log(i); }",
			output: `for (let i = 0; i < 20; i += 5) {
    console.log(i);
}`,
		},
		{
			title: "range with negative step",
			input: "for (let i in (10...0).stepBy(-1)) { console.log(i); }",
			output: `for (let i = 10; i > 0; i += -1) {
    console.log(i);
}`,
		},
		{
			title: "range with variable bounds",
			input: "for (let i in start...end) { console.log(i); }",
			output: `for (let i = start; i < end; i++) {
    console.log(i);
}`,
		},
		{
			title: "nested range loops",
			input: `for (let i in 0...3) {
    for (let j in 0...3) {
        console.log(i, j);
    }
}`,
			output: `for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        console.log(i, j);
    }
}`,
		},
		{
			title: "range with complex body",
			input: `for (let i in 0...5) {
    const x = i * 2;
    console.log(x);
}`,
			output: `for (let i = 0; i < 5; i++) {
    const x = i * 2;
    console.log(x);
}`,
		},
	}

	for _, rec := range data {
		t.Run(rec.title, func(t *testing.T) {
			t.Parallel()
			options := &core.CompilerOptions{}
			file := parsetestutil.ParseTypeScript(rec.input, false /*jsx*/)
			parsetestutil.CheckDiagnostics(t, file)
			binder.BindSourceFile(file)
			emitContext := printer.NewEmitContext()
			resolver := binder.NewReferenceResolver(options, binder.ReferenceResolverHooks{})
			opts := &transformers.TransformOptions{
				CompilerOptions: options,
				Context:         emitContext,
				Resolver:        resolver,
			}
			transformedFile := haxetransforms.GetHaxeTransformer(opts).TransformSourceFile(file)
			emittestutil.CheckEmit(t, emitContext, transformedFile, rec.output)
		})
	}
}

// TestPropertyAccessorTransformer tests the Haxe-style property accessor syntax
// Note: Current implementation keeps the return statement in setters
func TestPropertyAccessorTransformer(t *testing.T) {
	t.Parallel()
	data := []struct {
		title  string
		input  string
		output string
	}{
		{
			title: "simple getter and setter",
			input: `class Rectangle {
    private _width: number = 0;
    public var width(get, set): number;
    
    get_width(): number {
        return this._width;
    }
    
    set_width(value: number): number {
        return this._width = value;
    }
}`,
			output: `class Rectangle {
    private _width: number = 0;
    get width(): number {
        return this._width;
    }
    set width(value: number) {
        return this._width = value;
    }
}`,
		},
		{
			title: "read-only property",
			input: `class Circle {
    private _radius: number = 0;
    public var area(get, never): number;
    
    get_area(): number {
        return Math.PI * this._radius * this._radius;
    }
}`,
			output: `class Circle {
    private _radius: number = 0;
    get area(): number {
        return Math.PI * this._radius * this._radius;
    }
}`,
		},
		{
			title: "write-only property",
			input: `class Person {
    private _id: number = 0;
    public var id(never, set): number;
    
    set_id(value: number): number {
        return this._id = value;
    }
}`,
			output: `class Person {
    private _id: number = 0;
    set id(value: number) {
        return this._id = value;
    }
}`,
		},
		{
			title: "multiple properties",
			input: `class Rectangle {
    private _width: number = 0;
    private _height: number = 0;
    public var width(get, set): number;
    public var height(get, set): number;
    public var area(get, never): number;
    
    get_width(): number {
        return this._width;
    }
    
    set_width(value: number): number {
        return this._width = Math.max(0, value);
    }
    
    get_height(): number {
        return this._height;
    }
    
    set_height(value: number): number {
        return this._height = Math.max(0, value);
    }
    
    get_area(): number {
        return this._width * this._height;
    }
}`,
			output: `class Rectangle {
    private _width: number = 0;
    private _height: number = 0;
    get width(): number {
        return this._width;
    }
    set width(value: number) {
        return this._width = Math.max(0, value);
    }
    get height(): number {
        return this._height;
    }
    set height(value: number) {
        return this._height = Math.max(0, value);
    }
    get area(): number {
        return this._width * this._height;
    }
}`,
		},
	}

	for _, rec := range data {
		t.Run(rec.title, func(t *testing.T) {
			t.Parallel()
			options := &core.CompilerOptions{}
			file := parsetestutil.ParseTypeScript(rec.input, false /*jsx*/)
			parsetestutil.CheckDiagnostics(t, file)
			binder.BindSourceFile(file)
			emitContext := printer.NewEmitContext()
			resolver := binder.NewReferenceResolver(options, binder.ReferenceResolverHooks{})
			opts := &transformers.TransformOptions{
				CompilerOptions: options,
				Context:         emitContext,
				Resolver:        resolver,
			}
			transformedFile := haxetransforms.GetHaxeTransformer(opts).TransformSourceFile(file)
			emittestutil.CheckEmit(t, emitContext, transformedFile, rec.output)
		})
	}
}

// TestIntegratedHaxeFeatures tests multiple Haxe features working together
func TestIntegratedHaxeFeatures(t *testing.T) {
	t.Parallel()
	data := []struct {
		title  string
		input  string
		output string
	}{
		{
			title: "range iteration with property accessor",
			input: `class Counter {
    private _count: number = 0;
    public var count(get, never): number;
    
    get_count(): number {
        return this._count;
    }
    
    increment(): void {
        for (let i in 0...5) {
            this._count++;
        }
    }
}`,
			output: `class Counter {
    private _count: number = 0;
    get count(): number {
        return this._count;
    }
    increment(): void {
        for (let i = 0; i < 5; i++) {
            this._count++;
        }
    }
}`,
		},
	}

	for _, rec := range data {
		t.Run(rec.title, func(t *testing.T) {
			t.Parallel()
			options := &core.CompilerOptions{}
			file := parsetestutil.ParseTypeScript(rec.input, false /*jsx*/)
			parsetestutil.CheckDiagnostics(t, file)
			binder.BindSourceFile(file)
			emitContext := printer.NewEmitContext()
			resolver := binder.NewReferenceResolver(options, binder.ReferenceResolverHooks{})
			opts := &transformers.TransformOptions{
				CompilerOptions: options,
				Context:         emitContext,
				Resolver:        resolver,
			}
			
			// Apply all Haxe transformers using the combined transformer
			file = haxetransforms.GetHaxeTransformer(opts).TransformSourceFile(file)
			
			emittestutil.CheckEmit(t, emitContext, file, rec.output)
		})
	}
}