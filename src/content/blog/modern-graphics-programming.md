---
title: "Modern Graphics Programming with WebGPU"
description: "Comparing modern programming languages in the WebGPU world."
pubDate: "May 29 2025"
---

# Modern Graphics Programming: A Tale of Two Stacks

## Introduction
In this article, I will talk about my experience building two small particle simulation projects using WebGPU, one in Rust and the other in Zig. The goal is to compare the development experience, performance, and overall usability of these two stacks for modern graphics programming.
The source code for both implementations is available on my GitHub:
- 3D Simulation - [Rust + Wgpu + Egui + Winit](https://github.com/lucascompython/particle-simulation-3d)
- 2D Simulation - [Zig + Dawn/Wgpu-Native + ImGui + SDL3](https://github.com/lucascompython/particle-simulation-2d)


### Brief overview of WebGPU as a modern graphics API
WebGPU is a next-generation graphics API designed to provide high-performance access to modern GPU capabilities across different platforms. In the browser it's intended to supersede WebGL[^1]. WebGPU offers a more efficient and flexible interface for developers, enabling advanced graphics rendering and compute operations.

There are two main implementations of WebGPU:
- Rust based [wgpu](https://wgpu.rs/) (Mozilla's implementation used in Firefox)
- C++ based [dawn](https://dawn.googlesource.com/dawn/) (Google's implementation used in Chrome).

Both implementations implement the [webgpu.h](https://webgpu-native.github.io/webgpu-headers/) C spec.

[^1]: Althrogh WebGPU is meant to supersede WebGL, it is still not widely supported in browsers. As of May 2025, only around 73% of users have access to WebGPU in their browsers, according to [caniuse.com](https://caniuse.com/webgpu).

### Why WebGPU is important for cross-platform graphics development
WebGPU is a well designed API[^2] that that makes it easier to use unerlying Vulkan, Metal, DirectX, and OpenGL capabilities. It's a higher-level API compared to Vulkan and DirectX 12, but still provides lower-level access to GPU features compared to OpenGL. You can think of it as a replacement to something like [bgfx](https://github.com/bkaradzic/bgfx), that doesn't have a [crappy build system](https://github.com/bkaradzic/GENie), is an actual standard and is not a C++ library.

[^2]: The WebGPU specification is still not final, but it is already being used in production by companies like [Pounce Light](https://store.steampowered.com/app/2198150/Tiny_Glade/) and [Google](https://web.dev/webgpu/).

### My motivation for exploring different programming stacks for WebGPU development
Im still new to graphics programming as a whole, before WebGPU I had only used OpenGL in small experiments. After watching an awesome [video by Madrigal Games](https://www.youtube.com/watch?v=DdMl4E7xQEY), I was inspired to explore WebGPU. I wanted to see how different modern programming languages and ecosystems handle WebGPU development, particularly focusing on Rust and Zig. Both are low-level, modern, systems languages that have unique features and philosophies that could impact the development experience, performance, and ease of use when working with WebGPU.


## Stack Overview

### Stack 1: Rust Ecosystem
- **Rust**: Overview of Rust as a systems programming language
  - Provides memory safety guarantees without garbage collection
  - Strong and well thought type system
  - Compile time guarantees and zero-cost abstractions that enable high performance and still provide a great developer experience
  - Big and still growing ecosystem
- **wgpu**: Native WebGPU implementation for Rust
  - Mozilla's backed implementation
  - The Rust API is designed to be safe and ergonomic
  - Easily integrates with the rest of the Rust ecosystem
  - Compiles without much friction to WebAssembly
  - Is becoming the de facto library for GPU programming in Rust
- **egui**: Immediate mode GUI library
  - Aims for simplicity and ease of use
  - Excellent integration with wgpu
  - Compared to ImGui, egui has better styling defaults
  - Supports both native and web platforms
- **winit**: Window handling and event loop
  - Provides a cross-platform way to create windows and handle input events
  - De facto standard for window management in Rust
  - Integrates well with wgpu and egui
  - In this project used with [eframe](https://github.com/emilk/egui/tree/main/crates/eframe) for easier web development

### Stack 2: Zig Ecosystem
- **Zig**: Overview of Zig as a systems programming language
  - Manual memory management approach
  - Simplicity and transparency focus, there are no hidden allocations
  - Awesome build system that is written in Zig itself
  - Very easy to integrate with C libraries, although I wish translating C enums to Zig was better
- **wgpu-native**: wgpu C API
  - Provides a C interface to the WebGPU API
  - In this project I just directly used the C API, because there doesn't seem to be a good, maintained Zig wrapper for wgpu yet
  - Easy to compile
  - Didn't have many compile time optimizations which resulted in larger binaries. I forked the library and added compile time optimizations. The fork is available [here](https://github.com/lucascompython/wgpu-native)
- **dawn**: Google's WebGPU implementation
  - Pain in the ass to compile
  - Has two build systems, [depot_tools](https://chromium.googlesource.com/chromium/tools/depot_tools.git) and [cmake](https://cmake.org/)
  - Using cmake you can't easily build a [static library](https://groups.google.com/g/dawn-graphics/c/i9QI9iBo0NA?pli=1)
  - Has better error messages than wgpu-native
  - Harder to compile to WebAssembly
- **imgui**: Dear ImGui integration
  - Battle tested GUI library
  - Very easy to integrate
  - Generated C bindings using the new and official [dear_bindings](https://github.com/dearimgui/dear_bindings) C header generator
- **SDL3**: Modern cross-platform development library
  - Been around for many years, used by all sorts of companies and big projects
  - Not so straightforward WebGPU integration, had to use an [extension](https://github.com/eliemichel/sdl3webgpu)
  - Feature-rich, SDL3 supports all kinds of input devices, platforms and targets and even has it's own [GPU abstraction library](https://wiki.libsdl.org/SDL3/CategoryGPU)

## Development Experience Comparison

### Setup & Tooling
- Development environment setup process for each stack
- Build systems and dependency management
- IDE support and development workflow
- Hot reloading capabilities

#### Development Environment Setup

- Rust: Using `cargo` for dependency management and building
  - Easy to set up with `cargo init` and adding dependencies in `Cargo.toml`
  - Good IDE support with tools like `rust-analyzer`
  - Doesn't require the developer to do anything special to target WebAssembly, just add the `wasm32-unknown-unknown` target
- Zig: Using `zig build` for dependency management and building
  - Requires more manual setup compared to Rust
  - I have to manually compile the C libraries and link them in the `build.zig`
  - Zig's build system is powerful but can be complex for newcomers
  - Good IDE support with tools like [`zls`](https://github.com/zigtools/zls)
  - Requires extra steps to target WebAssembly,

### Getting Started
While with Rust, I basically just followed the [eframe template](https://github.com/emilk/eframe_template) with very few lines of code, and already had a working WebGPU application with egui that worked both on native and web platforms, with Zig I had to write a lot more setup code to get a similar result.
My `build.zig` file is around 400 lines of code, it fetches the dependencies through `git submodules` and compiles them for the target platform with debug or release flags.

In the Rust project, I created an [xtask](https://github.com/lucascompython/particle-simulation-3d/tree/main/release) for building the project for release. In Rust it's harder to get smaller, optimized binaries, often requiring many additional nightly flags and compiler options.

In a few minutes you can have a working WebGPU application in Rust, while in Zig it takes a lot more time to set up the project structure and build system, although for future projects it will be easier to setup since you can reuse code from the `build.zig` file.

### Performance

- Runtime performance observations
- Compilation times
- Memory usage
- Optimization capabilities

#### Runtime Performance
Since one project is a 3D simulation and the other is a 2D simulation, I will not compare the runtime perfomance directly.

#### Compilation Times
The following table shows the compilation times for both projects in different scenarios, measured on a machine with an Intel Core i5-7400T (4) @ 3.00 GHz CPU and 8GB of RAM.

In both projects I disabled features I didn't need, like support for various shading languages, a bunch of SDL and dawn features, and so on.

| Stack           | Debug Build Time | Debug with Cache Build Time | Release Build Time |
| --------------- | ---------------- | ----------------------------| ------------------ |
| Rust            | 3m31s            | Between 1 and 10 seconds    | 2m53s              |
| Zig wgpu-native | 2m49s            | Between 3 and 10 seconds    | 4m14s              |
| Zig dawn        | 15m50s           | Between 3 and 10 seconds    | 18m35s             |

### Shader Development

#### Overall WGSL experience
I used WGSL for both projects, which is the recommended shading language for WebGPU. WGSL is designed to be easy to read and write, with a syntax similar to Rust. It provides strong type safety and allows for better integration with the WebGPU API.
I've heard some people complain about WGSL being a step back from just using SPIR-V, and that it is another language to learn with its own quirks, but as a newcomer to graphics programming, I found WGSL to be a good choice. It is easy to read and write.

#### Shader compilation and validation
Here I just wanted to highlight that in Rust using `wgpu` directly, I can use the `device.create_shader_module_trusted()` to customize which exact checks are omitted for performance, but in `wgpu-native` this function is not exposed ([open issue](https://github.com/gfx-rs/wgpu-native/issues/396)). In dawn I haven't found the equivalent function.

#### Debugging shader issues
Both implementations provide good error messages when there are issues with the shaders.


### API Ergonomics

When it comes to resource management, both implementations are pleasant to work with and provide clear APIs for creating and managing GPU resources. However, one major pain point I encountered when using Zig is how C enums are translated. Instead of becoming Zig enums, they are represented as their own structs, which makes the code more verbose and harder to type. 

In contrast, `wgpu` is designed primarily for Rust, and its API feels very idiomatic and ergonomic. Overall, the Rust experience is smoother and more enjoyable from an API ergonomics perspective.

### GUI Integration

#### Getting Started and API Experience
egui feels easier to get started with compared to ImGui. While ImGui isn't particularly hard to work with, there are additional steps involved. Since ImGui is built with C++, I had to generate C bindings as an extra build step. The overall API is a C API, which, while still pleasant to work with and easy to read and write, is not very ergonomic compared to native language APIs.

egui, on the other hand, is Rust and Rust only. The API is much more ergonomic and idiomatic to Rust developers. There's no additional build step required - it just works out of the box and integrates seamlessly with the rest of the Rust ecosystem.

#### Styling and Visual Appeal
Both egui and ImGui offer ways to customize styles and appearance. However, in my opinion, egui's default styles are modern and good-looking, while ImGui's defaults feel old and square. I had to modify the ImGui styles to achieve a more modern look, whereas egui looked great right out of the box.

#### Cross-Platform Development
egui offers eframe, the egui framework that provides a really simple and straightforward way to make an app for both web and native platforms. With ImGui, it's a bit harder to get web support working, requiring more manual setup and configuration.

#### Community and Ecosystem
ImGui has been around for much longer and has a much larger community, with extensive documentation, examples, and third-party extensions. However, egui has quickly become one of the most popular GUI libraries in the Rust ecosystem and continues to grow rapidly.

#### Performance and Features
Both libraries perform well for immediate mode GUIs. ImGui's maturity shows in its extensive feature set and battle-tested reliability across many projects. egui, while newer, provides excellent WebGPU integration and supports both native and web platforms seamlessly.

### Community & Ecosystem
- Library maturity and stability
- Documentation quality
- Community size and helpfulness
- Example availability

## Project Showcase
- Brief description of a sample project implemented in both stacks
- Key implementation differences
- Screenshots and visual comparisons
- Challenges encountered in each implementation

## Pain Points

### Rust Stack Challenges
- Specific challenges encountered with Rust + wgpu + egui + winit
- Workarounds and solutions

### Zig Stack Challenges
- Specific challenges encountered with Zig + wgpu/dawn + imgui + SDL3
- Workarounds and solutions

## Learning Curve
- Prior knowledge requirements
- Time investment to become productive
- Debugging complexity
- Common pitfalls

## Future Outlook
- Ecosystem maturity trajectory
- Upcoming features in respective libraries
- Which stack seems most promising for future WebGPU development

## Conclusion
- Summary of findings
- Recommendations based on different project requirements
- Personal preference and reasoning
- Final thoughts on the WebGPU landscape

## Resources
- Links to documentation for all technologies mentioned
- Useful tutorials and learning resources
- My sample code repositories for both implementations
- Community forums and discussion groups
