
{ pkgs ? import <nixpkgs> {} }:
with pkgs;
let
  my-python-packages = python-packages: with python-packages; [
    pandas
    requests
    # other python packages you want
  ]; 
  python-with-my-packages = python3.withPackages my-python-packages;
in
pkgs.stdenv.mkDerivation {
   name = "platformio-shell";
   buildInputs = with pkgs;
    [
      python-with-my-packages
      nodejs
    ];
   shellHook = ''
   '';          
}
