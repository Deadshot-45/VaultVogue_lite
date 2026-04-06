"use client";

import React from "react";

type Dispatcher = Record<string, (...args: unknown[]) => void>;

const noop = () => {};

const dispatcher: Dispatcher = new Proxy(
  {},
  {
    get() {
      return noop;
    },
  },
);

const DevOverlayContext = React.createContext<unknown>(null);

function renderAppDevOverlay() {
  return null;
}

function renderPagesDevOverlay() {
  return null;
}

function getSerializedOverlayState() {
  return {
    buildError: null,
    buildingIndicator: false,
    cacheIndicator: "disabled",
    devToolsPanelPosition: {},
    devToolsPanelSize: { kind: "fixed", height: 0, width: 0 },
    devToolsPosition: "right",
    disableDevIndicator: true,
    errors: [],
    instantNavs: false,
    isErrorOverlayOpen: false,
    nextId: 0,
    refreshState: { type: "idle" },
    renderingIndicator: false,
    routerType: "app",
    runtimeErrors: [],
    scale: 1,
    showIndicator: false,
    staticIndicator: "disabled",
    theme: "system",
  };
}

function getSegmentTrieData() {
  return null;
}

function useDevOverlayContext() {
  return React.useContext(DevOverlayContext);
}

export {
  DevOverlayContext,
  dispatcher,
  getSegmentTrieData,
  getSerializedOverlayState,
  renderAppDevOverlay,
  renderPagesDevOverlay,
  useDevOverlayContext,
};

export default {
  DevOverlayContext,
  dispatcher,
  getSegmentTrieData,
  getSerializedOverlayState,
  renderAppDevOverlay,
  renderPagesDevOverlay,
  useDevOverlayContext,
};
