# Nix Dev Environments

<aside>
💡

One of Nix’s core features is the ability to spin up a reproducible dev environment 

</aside>

# What is Nix?

Nix is both a package manager and configuration manager- In our use case we’re going to use it create reproducible, declarative and reliable development environments using `flakes`

**Download Nix:** 

```bash
$ sh <(curl -L https://nixos.org/nix/install)
```

## What are Flakes?

Nix flakes are files which output nix expressions that can do things such as **Build Packages**, **Run Programs**, and use **Development Environments.** 

Flakes are essentially processors of Nix Code. They can either live locally on your file system, or at a specific address 

# Entering Nix

direnv → auto enter nix when you cd into the directory 

## nix develop `some-address-to-a-flake`

- used the flake reference to pull some nix code and build out a specific flake output
- built the packages within the flake
- set up an environment with a PATH that has both git and curl

### Shell Hooks

1. Arbirtrary shell code that runs whenever an environment starts up
2. Some use cases: 
    1. `Echo` some information about the console or whatever 
    2. Checkers and Linters 

### Environment Variables

- Set logging levels using **`LOG_LEVEL`** or whatever is appropriate for the tools you’re using.
- Set the environment using variables like **`NODE_ENV`** (for [**Node.js**](https://nodejs.org/)) to **`development`**, **`dev`**, and so on.

# Run Commands

```jsx
nix develop `some-address-to-a-flake` --command git help 
nix develop `some-address-to-a-flake` --command curl https://example.com 
```

## Language Specific Environments

```jsx
**nix develop "github:DeterminateSystems/zero-to-nix#cpp"
nix develop "github:DeterminateSystems/zero-to-nix#go"
nix develop "github:DeterminateSystems/zero-to-nix#haskell"
nix develop "github:DeterminateSystems/zero-to-nix#javascript"
nix develop "github:DeterminateSystems/zero-to-nix#python"
nix develop "github:DeterminateSystems/zero-to-nix#rust"
nix develop "github:DeterminateSystems/zero-to-nix#scala"**
```

# Creating Local Flakes

```jsx
mkdir nix-javascript-dev && cd nix-javascript-dev
nix flake init --template "github:DeterminateSystems/zero-to-nix#javascript-dev"
```

`nix flake init --template "github:DeterminateSystems/zero-to-nix#javascript-dev"`

### Running Flakes

Within the flake.nix file, a few things are happening: 

1. We have the flake inputs 
2. We have the flake outputs
    1. This will tell nix what packages to build
    2. builds the packages and puts them in the nix store 

# Writing Flakes

- The `description` attribute is a one-line description shown by `nix flake metadata`.
- The `inputs` attribute specifies other flakes that this flake depends on. These are fetched by Nix and passed as arguments to the `outputs` function.
    - So here we want to use the flake for nix package so we can use it to get the stuff we want
- The `inputs` attribute specifies other flakes that this flake depends on. These are fetched by Nix and passed as arguments to the `outputs` function.
- The `self` argument denotes *this* flake. Its primarily useful for referring to the source of the flake (as in `src = self;`) or to other outputs (e.g. `self.defaultPackage.x86_64-linux`).
-