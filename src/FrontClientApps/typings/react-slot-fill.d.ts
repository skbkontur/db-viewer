import * as React from "react";

export class Provider extends React.Component {}

export class Slot extends React.Component<{ name: string }> {}

export class Fill extends React.Component<{ name: string; [key: string]: any }> {}
