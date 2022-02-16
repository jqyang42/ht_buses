import React, { Component } from 'react'
import { MARKER_COLORS } from '../../constants';

const TOTAL_COLORS = MARKER_COLORS.length;
export default class RouteColor {
    static instance = null;
    static createInstance() {
        var object = new RouteColor();
        return object;
    }
    static getInstance () {
        if (!RouteColor.instance) {
          RouteColor.instance = RouteColor.createInstance();
        }
        return RouteColor.instance;
    }

    list = [...Array(51).keys()];

    popColorID () {
        return this.list.shift();
    }

    pushColorID () {
        index = 0
        while (index < this.list.length && index == this.list[index]) {
          index += 1
        }
        this.list.splice(index)
    }
    
    
}
export default React.memo(StopMarker)