# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.22

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:

#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:

# Disable VCS-based implicit rules.
% : %,v

# Disable VCS-based implicit rules.
% : RCS/%

# Disable VCS-based implicit rules.
% : RCS/%,v

# Disable VCS-based implicit rules.
% : SCCS/s.%

# Disable VCS-based implicit rules.
% : s.%

.SUFFIXES: .hpux_make_needs_suffix_list

# Command-line flag to silence nested $(MAKE).
$(VERBOSE)MAKESILENT = -s

#Suppress display of executed commands.
$(VERBOSE).SILENT:

# A target that is always out of date.
cmake_force:
.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/bin/cmake

# The command to remove a file.
RM = /usr/bin/cmake -E rm -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /home/archit/.cargo/registry/src/index.crates.io-6f17d22bba15001f/mbedtls-sys-auto-2.28.7/vendor

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /home/archit/Desktop/final_hackathon_project/Futures_on_Chain/rofl-oracle/target/release/build/mbedtls-sys-auto-cbddbc35b5546c8e/out/build

# Utility rule file for apidoc.

# Include any custom commands dependencies for this target.
include CMakeFiles/apidoc.dir/compiler_depend.make

# Include the progress variables for this target.
include CMakeFiles/apidoc.dir/progress.make

CMakeFiles/apidoc:
	cd /home/archit/.cargo/registry/src/index.crates.io-6f17d22bba15001f/mbedtls-sys-auto-2.28.7/vendor/doxygen && doxygen mbedtls.doxyfile

apidoc: CMakeFiles/apidoc
apidoc: CMakeFiles/apidoc.dir/build.make
.PHONY : apidoc

# Rule to build all files generated by this target.
CMakeFiles/apidoc.dir/build: apidoc
.PHONY : CMakeFiles/apidoc.dir/build

CMakeFiles/apidoc.dir/clean:
	$(CMAKE_COMMAND) -P CMakeFiles/apidoc.dir/cmake_clean.cmake
.PHONY : CMakeFiles/apidoc.dir/clean

CMakeFiles/apidoc.dir/depend:
	cd /home/archit/Desktop/final_hackathon_project/Futures_on_Chain/rofl-oracle/target/release/build/mbedtls-sys-auto-cbddbc35b5546c8e/out/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /home/archit/.cargo/registry/src/index.crates.io-6f17d22bba15001f/mbedtls-sys-auto-2.28.7/vendor /home/archit/.cargo/registry/src/index.crates.io-6f17d22bba15001f/mbedtls-sys-auto-2.28.7/vendor /home/archit/Desktop/final_hackathon_project/Futures_on_Chain/rofl-oracle/target/release/build/mbedtls-sys-auto-cbddbc35b5546c8e/out/build /home/archit/Desktop/final_hackathon_project/Futures_on_Chain/rofl-oracle/target/release/build/mbedtls-sys-auto-cbddbc35b5546c8e/out/build /home/archit/Desktop/final_hackathon_project/Futures_on_Chain/rofl-oracle/target/release/build/mbedtls-sys-auto-cbddbc35b5546c8e/out/build/CMakeFiles/apidoc.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : CMakeFiles/apidoc.dir/depend

