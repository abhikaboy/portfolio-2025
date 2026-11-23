# Go Learning

# Essentials

### Pointers

```go
i, j := 10, 20 

p := &i // Points p to i 
*p = 21 // Sets i THROUGH p 

p = &j // p now points to j 
*p = 100 // j is now set to 100 through the pointer p 
```

### Structs

```go
type Vertex struct { 
	X int 
	Y int 
}

v := Vertex{1,2} // creates a new Vertex 
fmt.Println(v.X) // use dot notation to print a value from a struct 

```

### Pointers to Structs

```go
p := &v // p now points to the vertex v 
p.X = 10 // this will set the value of X field on the vertex v through p 

// Because its a struct, it doesn't need the "*" refernce directly 
fmt.Println(p) -> // will print the pointer to p 

```

### Arrays

```go
var a [2]string // creates an array of size 2 with empty strings 
a[:1] // go supports array slicing 

// Channging the contents of a slice changes the original array

names := [4]int{1,2,3,4,5}

x = names[0:3] // takes the first 3 elements 
x[2] = 20

fmt.Println(names) // -> 1 2 30 4 5 

// The zero value of a slice is nil 
```

### Make

Slices can be created with the built-in `make` function; this is how you create dynamically-sized arrays.

```go
a := make([]int,5) // creates a zeroed array and returns a slice that refers to that array 

// Specify Length and Capacity 
a := make([]int,5,10) // Array of length 5 and capacity 10 
```

```go
board := make([][]string{
	[]string{"-","-","-"},
	[]string{"-","-","-"},
	[]string{"-","-","-"},
})
```

### Appending to Slices

```go
v := append(SLICE,VALUE) // you must pass in the slice of type T and values of T 
```

```go
// Will iterate over the slice "array" and return two values each time, the 
// index and then the value located at that index 

for i, v := range array {
	fmt.Println(i,v) 
}

// Can skip either or by passing _ 

for _, v := range array {}
for i := range array {} 

```

### Maps

key value pairs 

```go
m = make(map[string]Vertex) // map[key]Value 

var m = map[string]Vertex{
	"Bob": Vertex{
		12,30
	},
	"John": Vertex{
		340, 600
	}
}

// -> Bob:{12,30}, John:{340,600}

m[key] = elem // -> Insert
elem = m[key] // -> Retreive 
delete(m, key) // -> Delete 
elem, ok = m[key] // -> Verify Presence 

```

# Classes

You cant write classes in GO actually, but you can define methods on types 

A method is a function with its own receiver argument → Meaning you can bind a specific method onto a type 

```go
type Vertex {
	X,Y float64
}

func (v Vertex) Abs() float64{
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

func main(){
	var v = Vertex(3,4)
	fmt.Println(v.Abs()) // -> 5 
}
```

### Methods with Pointers

Methods with pointer receivers can modify the values of the receiver that it points to, this is pretty common and is actually more likely to be seen than value pointers 

With a value receiver the method will operate on a copy of the original vertex. 

```go
type Vertex {
	X,Y float64
}

func (v Vertex) Abs() float64{
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

func (v *Vertex) Scale(f float64) { // void method 
	v.X = v.X * f
	v.Y = v.Y * f
}
```

Methods that have pointer arguments MUST have a pointer passed into it 

### Interfaces

A set of method signatures