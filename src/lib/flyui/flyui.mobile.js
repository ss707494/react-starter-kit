(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s
})({
    1: [ // FastClick
        
        function(require, module, exports) {
            'use strict';

            /**
             * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
             *
             * @codingstandard ftlabs-jsv2
             * @copyright The Financial Times Limited [All Rights Reserved]
             * @license MIT License (see LICENSE.txt)
             */

            /*jslint browser:true, node:true*/
            /*global define, Event, Node*/


            /**
             * Instantiate fast-clicking listeners on the specified layer.
             *
             * @constructor
             * @param {Element} layer The layer to listen on
             * @param {Object} [options={}] The options to override the defaults
             */
            function FastClick(layer, options) {
                var oldOnClick;

                options = options || {};

                /**
                 * Whether a click is currently being tracked.
                 *
                 * @type boolean
                 */
                this.trackingClick = false;


                /**
                 * Timestamp for when click tracking started.
                 *
                 * @type number
                 */
                this.trackingClickStart = 0;


                /**
                 * The element being tracked for a click.
                 *
                 * @type EventTarget
                 */
                this.targetElement = null;


                /**
                 * X-coordinate of touch start event.
                 *
                 * @type number
                 */
                this.touchStartX = 0;


                /**
                 * Y-coordinate of touch start event.
                 *
                 * @type number
                 */
                this.touchStartY = 0;


                /**
                 * ID of the last touch, retrieved from Touch.identifier.
                 *
                 * @type number
                 */
                this.lastTouchIdentifier = 0;


                /**
                 * Touchmove boundary, beyond which a click will be cancelled.
                 *
                 * @type number
                 */
                this.touchBoundary = options.touchBoundary || 10;


                /**
                 * The FastClick layer.
                 *
                 * @type Element
                 */
                this.layer = layer;

                /**
                 * The minimum time between tap(touchstart and touchend) events
                 *
                 * @type number
                 */
                this.tapDelay = options.tapDelay || 200;

                /**
                 * The maximum time for a tap
                 *
                 * @type number
                 */
                this.tapTimeout = options.tapTimeout || 700;

                if (FastClick.notNeeded(layer)) {
                    return;
                }

                // Some old versions of Android don't have Function.prototype.bind
                function bind(method, context) {
                    return function() {
                        return method.apply(context, arguments);
                    };
                }


                var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
                var context = this;
                for (var i = 0, l = methods.length; i < l; i++) {
                    context[methods[i]] = bind(context[methods[i]], context);
                }

                // Set up event handlers as required
                if (deviceIsAndroid) {
                    layer.addEventListener('mouseover', this.onMouse, true);
                    layer.addEventListener('mousedown', this.onMouse, true);
                    layer.addEventListener('mouseup', this.onMouse, true);
                }

                layer.addEventListener('click', this.onClick, true);
                layer.addEventListener('touchstart', this.onTouchStart, false);
                layer.addEventListener('touchmove', this.onTouchMove, false);
                layer.addEventListener('touchend', this.onTouchEnd, false);
                layer.addEventListener('touchcancel', this.onTouchCancel, false);

                // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
                // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
                // layer when they are cancelled.
                if (!Event.prototype.stopImmediatePropagation) {
                    layer.removeEventListener = function(type, callback, capture) {
                        var rmv = Node.prototype.removeEventListener;
                        if (type === 'click') {
                            rmv.call(layer, type, callback.hijacked || callback, capture);
                        } else {
                            rmv.call(layer, type, callback, capture);
                        }
                    };

                    layer.addEventListener = function(type, callback, capture) {
                        var adv = Node.prototype.addEventListener;
                        if (type === 'click') {
                            adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
                                if (!event.propagationStopped) {
                                    callback(event);
                                }
                            }), capture);
                        } else {
                            adv.call(layer, type, callback, capture);
                        }
                    };
                }

                // If a handler is already declared in the element's onclick attribute, it will be fired before
                // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
                // adding it as listener.
                if (typeof layer.onclick === 'function') {

                    // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
                    // - the old one won't work if passed to addEventListener directly.
                    oldOnClick = layer.onclick;
                    layer.addEventListener('click', function(event) {
                        oldOnClick(event);
                    }, false);
                    layer.onclick = null;
                }
            }

            /**
             * Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
             *
             * @type boolean
             */
            var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

            /**
             * Android requires exceptions.
             *
             * @type boolean
             */
            var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


            /**
             * iOS requires exceptions.
             *
             * @type boolean
             */
            var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


            /**
             * iOS 4 requires an exception for select elements.
             *
             * @type boolean
             */
            var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


            /**
             * iOS 6.0-7.* requires the target element to be manually derived
             *
             * @type boolean
             */
            var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

            /**
             * BlackBerry requires exceptions.
             *
             * @type boolean
             */
            var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

            /**
             * Determine whether a given element requires a native click.
             *
             * @param {EventTarget|Element} target Target DOM element
             * @returns {boolean} Returns true if the element needs a native click
             */
            FastClick.prototype.needsClick = function(target) {
                switch (target.nodeName.toLowerCase()) {

                    // Don't send a synthetic click to disabled inputs (issue #62)
                    case 'button':
                    case 'select':
                    case 'textarea':
                        if (target.disabled) {
                            return true;
                        }

                        break;
                    case 'input':

                        // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
                        if ((deviceIsIOS && target.type === 'file') || target.disabled) {
                            return true;
                        }

                        break;
                    case 'label':
                    case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
                    case 'video':
                        return true;
                }

                return (/\bneedsclick\b/).test(target.className);
            };


            /**
             * Determine whether a given element requires a call to focus to simulate click into element.
             *
             * @param {EventTarget|Element} target Target DOM element
             * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
             */
            FastClick.prototype.needsFocus = function(target) {
                switch (target.nodeName.toLowerCase()) {
                    case 'textarea':
                        return true;
                    case 'select':
                        return !deviceIsAndroid;
                    case 'input':
                        switch (target.type) {
                            case 'button':
                            case 'checkbox':
                            case 'file':
                            case 'image':
                            case 'radio':
                            case 'submit':
                                return false;
                        }

                        // No point in attempting to focus disabled inputs
                        return !target.disabled && !target.readOnly;
                    default:
                        return (/\bneedsfocus\b/).test(target.className);
                }
            };


            /**
             * Send a click event to the specified element.
             *
             * @param {EventTarget|Element} targetElement
             * @param {Event} event
             */
            FastClick.prototype.sendClick = function(targetElement, event) {
                var clickEvent, touch;

                // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
                if (document.activeElement && document.activeElement !== targetElement) {
                    document.activeElement.blur();
                }

                touch = event.changedTouches[0];

                // Synthesise a click event, with an extra attribute so it can be tracked
                clickEvent = document.createEvent('MouseEvents');
                clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
                clickEvent.forwardedTouchEvent = true;
                targetElement.dispatchEvent(clickEvent);
            };

            FastClick.prototype.determineEventType = function(targetElement) {

                //Issue #159: Android Chrome Select Box does not open with a synthetic click event
                if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
                    return 'mousedown';
                }

                return 'click';
            };


            /**
             * @param {EventTarget|Element} targetElement
             */
            FastClick.prototype.focus = function(targetElement) {
                var length;

                // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
                if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
                    length = targetElement.value.length;
                    targetElement.setSelectionRange(length, length);
                } else {
                    targetElement.focus();
                }
            };


            /**
             * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
             *
             * @param {EventTarget|Element} targetElement
             */
            FastClick.prototype.updateScrollParent = function(targetElement) {
                var scrollParent, parentElement;

                scrollParent = targetElement.fastClickScrollParent;

                // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
                // target element was moved to another parent.
                if (!scrollParent || !scrollParent.contains(targetElement)) {
                    parentElement = targetElement;
                    do {
                        if (parentElement.scrollHeight > parentElement.offsetHeight) {
                            scrollParent = parentElement;
                            targetElement.fastClickScrollParent = parentElement;
                            break;
                        }

                        parentElement = parentElement.parentElement;
                    } while (parentElement);
                }

                // Always update the scroll top tracker if possible.
                if (scrollParent) {
                    scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
                }
            };


            /**
             * @param {EventTarget} targetElement
             * @returns {Element|EventTarget}
             */
            FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

                // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
                if (eventTarget.nodeType === Node.TEXT_NODE) {
                    return eventTarget.parentNode;
                }

                return eventTarget;
            };


            /**
             * On touch start, record the position and scroll offset.
             *
             * @param {Event} event
             * @returns {boolean}
             */
            FastClick.prototype.onTouchStart = function(event) {
                var targetElement, touch, selection;

                // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
                if (event.targetTouches.length > 1) {
                    return true;
                }

                targetElement = this.getTargetElementFromEventTarget(event.target);
                touch = event.targetTouches[0];

                if (deviceIsIOS) {

                    // Only trusted events will deselect text on iOS (issue #49)
                    selection = window.getSelection();
                    if (selection.rangeCount && !selection.isCollapsed) {
                        return true;
                    }

                    if (!deviceIsIOS4) {

                        // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
                        // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
                        // with the same identifier as the touch event that previously triggered the click that triggered the alert.
                        // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
                        // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
                        // Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
                        // which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
                        // random integers, it's safe to to continue if the identifier is 0 here.
                        if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
                            event.preventDefault();
                            return false;
                        }

                        this.lastTouchIdentifier = touch.identifier;

                        // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
                        // 1) the user does a fling scroll on the scrollable layer
                        // 2) the user stops the fling scroll with another tap
                        // then the event.target of the last 'touchend' event will be the element that was under the user's finger
                        // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
                        // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
                        this.updateScrollParent(targetElement);
                    }
                }

                this.trackingClick = true;
                this.trackingClickStart = event.timeStamp;
                this.targetElement = targetElement;

                this.touchStartX = touch.pageX;
                this.touchStartY = touch.pageY;

                // Prevent phantom clicks on fast double-tap (issue #36)
                if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
                    event.preventDefault();
                }

                return true;
            };


            /**
             * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
             *
             * @param {Event} event
             * @returns {boolean}
             */
            FastClick.prototype.touchHasMoved = function(event) {
                var touch = event.changedTouches[0],
                    boundary = this.touchBoundary;

                if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
                    return true;
                }

                return false;
            };


            /**
             * Update the last position.
             *
             * @param {Event} event
             * @returns {boolean}
             */
            FastClick.prototype.onTouchMove = function(event) {
                if (!this.trackingClick) {
                    return true;
                }

                // If the touch has moved, cancel the click tracking
                if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
                    this.trackingClick = false;
                    this.targetElement = null;
                }

                return true;
            };


            /**
             * Attempt to find the labelled control for the given label element.
             *
             * @param {EventTarget|HTMLLabelElement} labelElement
             * @returns {Element|null}
             */
            FastClick.prototype.findControl = function(labelElement) {

                // Fast path for newer browsers supporting the HTML5 control attribute
                if (labelElement.control !== undefined) {
                    return labelElement.control;
                }

                // All browsers under test that support touch events also support the HTML5 htmlFor attribute
                if (labelElement.htmlFor) {
                    return document.getElementById(labelElement.htmlFor);
                }

                // If no for attribute exists, attempt to retrieve the first labellable descendant element
                // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
                return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
            };


            /**
             * On touch end, determine whether to send a click event at once.
             *
             * @param {Event} event
             * @returns {boolean}
             */
            FastClick.prototype.onTouchEnd = function(event) {
                var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

                if (!this.trackingClick) {
                    return true;
                }

                // Prevent phantom clicks on fast double-tap (issue #36)
                if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
                    this.cancelNextClick = true;
                    return true;
                }

                if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
                    return true;
                }

                // Reset to prevent wrong click cancel on input (issue #156).
                this.cancelNextClick = false;

                this.lastClickTime = event.timeStamp;

                trackingClickStart = this.trackingClickStart;
                this.trackingClick = false;
                this.trackingClickStart = 0;

                // On some iOS devices, the targetElement supplied with the event is invalid if the layer
                // is performing a transition or scroll, and has to be re-detected manually. Note that
                // for this to function correctly, it must be called *after* the event target is checked!
                // See issue #57; also filed as rdar://13048589 .
                if (deviceIsIOSWithBadTarget) {
                    touch = event.changedTouches[0];

                    // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
                    targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
                    targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
                }

                targetTagName = targetElement.tagName.toLowerCase();
                if (targetTagName === 'label') {
                    forElement = this.findControl(targetElement);
                    if (forElement) {
                        this.focus(targetElement);
                        if (deviceIsAndroid) {
                            return false;
                        }

                        targetElement = forElement;
                    }
                } else if (this.needsFocus(targetElement)) {

                    // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
                    // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
                    if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
                        this.targetElement = null;
                        return false;
                    }

                    this.focus(targetElement);
                    this.sendClick(targetElement, event);

                    // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
                    // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
                    if (!deviceIsIOS || targetTagName !== 'select') {
                        this.targetElement = null;
                        event.preventDefault();
                    }

                    return false;
                }

                if (deviceIsIOS && !deviceIsIOS4) {

                    // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
                    // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
                    scrollParent = targetElement.fastClickScrollParent;
                    if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
                        return true;
                    }
                }

                // Prevent the actual click from going though - unless the target node is marked as requiring
                // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
                if (!this.needsClick(targetElement)) {
                    event.preventDefault();
                    this.sendClick(targetElement, event);
                }

                return false;
            };


            /**
             * On touch cancel, stop tracking the click.
             *
             * @returns {void}
             */
            FastClick.prototype.onTouchCancel = function() {
                this.trackingClick = false;
                this.targetElement = null;
            };


            /**
             * Determine mouse events which should be permitted.
             *
             * @param {Event} event
             * @returns {boolean}
             */
            FastClick.prototype.onMouse = function(event) {

                // If a target element was never set (because a touch event was never fired) allow the event
                if (!this.targetElement) {
                    return true;
                }

                if (event.forwardedTouchEvent) {
                    return true;
                }

                // Programmatically generated events targeting a specific element should be permitted
                if (!event.cancelable) {
                    return true;
                }

                // Derive and check the target element to see whether the mouse event needs to be permitted;
                // unless explicitly enabled, prevent non-touch click events from triggering actions,
                // to prevent ghost/doubleclicks.
                if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

                    // Prevent any user-added listeners declared on FastClick element from being fired.
                    if (event.stopImmediatePropagation) {
                        event.stopImmediatePropagation();
                    } else {

                        // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
                        event.propagationStopped = true;
                    }

                    // Cancel the event
                    event.stopPropagation();
                    event.preventDefault();

                    return false;
                }

                // If the mouse event is permitted, return true for the action to go through.
                return true;
            };


            /**
             * On actual clicks, determine whether this is a touch-generated click, a click action occurring
             * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
             * an actual click which should be permitted.
             *
             * @param {Event} event
             * @returns {boolean}
             */
            FastClick.prototype.onClick = function(event) {
                var permitted;

                // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
                if (this.trackingClick) {
                    this.targetElement = null;
                    this.trackingClick = false;
                    return true;
                }

                // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
                if (event.target.type === 'submit' && event.detail === 0) {
                    return true;
                }

                permitted = this.onMouse(event);

                // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
                if (!permitted) {
                    this.targetElement = null;
                }

                // If clicks are permitted, return true for the action to go through.
                return permitted;
            };


            /**
             * Remove all FastClick's event listeners.
             *
             * @returns {void}
             */
            FastClick.prototype.destroy = function() {
                var layer = this.layer;

                if (deviceIsAndroid) {
                    layer.removeEventListener('mouseover', this.onMouse, true);
                    layer.removeEventListener('mousedown', this.onMouse, true);
                    layer.removeEventListener('mouseup', this.onMouse, true);
                }

                layer.removeEventListener('click', this.onClick, true);
                layer.removeEventListener('touchstart', this.onTouchStart, false);
                layer.removeEventListener('touchmove', this.onTouchMove, false);
                layer.removeEventListener('touchend', this.onTouchEnd, false);
                layer.removeEventListener('touchcancel', this.onTouchCancel, false);
            };


            /**
             * Check whether FastClick is needed.
             *
             * @param {Element} layer The layer to listen on
             */
            FastClick.notNeeded = function(layer) {
                var metaViewport;
                var chromeVersion;
                var blackberryVersion;
                var firefoxVersion;

                // Devices that don't support touch don't need FastClick
                if (typeof window.ontouchstart === 'undefined') {
                    return true;
                }

                // Chrome version - zero for other browsers
                chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

                if (chromeVersion) {

                    if (deviceIsAndroid) {
                        metaViewport = document.querySelector('meta[name=viewport]');

                        if (metaViewport) {
                            // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
                            if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                                return true;
                            }
                            // Chrome 32 and above with width=device-width or less don't need FastClick
                            if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
                                return true;
                            }
                        }

                        // Chrome desktop doesn't need FastClick (issue #15)
                    } else {
                        return true;
                    }
                }

                if (deviceIsBlackBerry10) {
                    blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

                    // BlackBerry 10.3+ does not require Fastclick library.
                    // https://github.com/ftlabs/fastclick/issues/251
                    if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
                        metaViewport = document.querySelector('meta[name=viewport]');

                        if (metaViewport) {
                            // user-scalable=no eliminates click delay.
                            if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                                return true;
                            }
                            // width=device-width (or less than device-width) eliminates click delay.
                            if (document.documentElement.scrollWidth <= window.outerWidth) {
                                return true;
                            }
                        }
                    }
                }

                // IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
                if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
                    return true;
                }

                // Firefox version - zero for other browsers
                firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

                if (firefoxVersion >= 27) {
                    // Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

                    metaViewport = document.querySelector('meta[name=viewport]');
                    if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
                        return true;
                    }
                }

                // IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
                // http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
                if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
                    return true;
                }

                return false;
            };


            /**
             * Factory method for creating a FastClick object
             *
             * @param {Element} layer The layer to listen on
             * @param {Object} [options={}] The options to override the defaults
             */
            FastClick.attach = function(layer, options) {
                return new FastClick(layer, options);
            };


            if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

                // AMD. Register as an anonymous module.
                define(function() {
                    return FastClick;
                });
            } else if (typeof module !== 'undefined' && module.exports) {
                module.exports = FastClick.attach;
                module.exports.FastClick = FastClick;
            } else {
                window.FastClick = FastClick;
            }

            if ('addEventListener' in document) {
                document.addEventListener('DOMContentLoaded', function() {
                    FastClick.attach(document.body);
                }, false);
            }
        }, {}
    ],
    2: [ // Router
        
        function(require, module, exports) {

            var fly = require('./Core');
          

            function __dealCssEvent(eventNameArr, callback) {
                var events = eventNameArr,
                i,
                dom = this; // jshint ignore:line

                function fireCallBack(e) {
                    /*jshint validthis:true */
                    if (e.target !== this)
                        return;
                    callback.call(this, e);
                    for (i = 0; i < events.length; i++) {
                        dom.off(events[i], fireCallBack);
                    }
                }
                if (callback) {
                    for (i = 0; i < events.length; i++) {
                        dom.on(events[i], fireCallBack);
                    }
                }
            }
            $.fn.animationEnd = function (callback) {
                __dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
                return this;
            };
            $.fn.transitionEnd = function (callback) {
                __dealCssEvent.call(this, ['webkitTransitionEnd', 'transitionend'], callback);
                return this;
            };

            var EVENTS = {
                pageLoadStart: 'pageLoadStart', // ajax 开始加载新页面前
                pageLoadCancel: 'pageLoadCancel', // 取消前一个 ajax 加载动作后
                pageLoadError: 'pageLoadError', // ajax 加载页面失败后
                pageLoadComplete: 'pageLoadComplete', // ajax 加载页面完成后（不论成功与否）
                pageAnimationStart: 'pageAnimationStart', // 动画切换 page 前
                pageAnimationEnd: 'pageAnimationEnd', // 动画切换 page 结束后
                beforePageRemove: 'beforePageRemove', // 移除旧 document 前（适用于非内联 page 切换）
                pageRemoved: 'pageRemoved', // 移除旧 document 后（适用于非内联 page 切换）
                beforePageSwitch: 'beforePageSwitch', // page 切换前，在 pageAnimationStart 前，beforePageSwitch 之后会做一些额外的处理才触发 pageAnimationStart
                pageInit: 'pageInitInternal' // 目前是定义为一个 page 加载完毕后（实际和 pageAnimationEnd 等同）
            };

            var Util = {
                /**
                 * 获取 url 的 fragment（即 hash 中去掉 # 的剩余部分）
                 *
                 * 如果没有则返回空字符串
                 * 如: http://example.com/path/?query=d#123 => 123
                 *
                 * @param {String} url url
                 * @returns {String}
                 */
                getUrlFragment: function(url) {
                    var hashIndex = url.indexOf('#');
                    return hashIndex === -1 ? '' : url.slice(hashIndex + 1);
                },
                /**
                 * 获取一个链接相对于当前页面的绝对地址形式
                 *
                 * 假设当前页面是 http://a.com/b/c
                 * 那么有以下情况:
                 * d => http://a.com/b/d
                 * /e => http://a.com/e
                 * #1 => http://a.com/b/c#1
                 * http://b.com/f => http://b.com/f
                 *
                 * @param {String} url url
                 * @returns {String}
                 */
                getAbsoluteUrl: function(url) {
                    var link = document.createElement('a');
                    link.setAttribute('href', url);
                    var absoluteUrl = link.href;
                    link = null;
                    return absoluteUrl;
                },
                /**
                 * 获取一个 url 的基本部分，即不包括 hash
                 *
                 * @param {String} url url
                 * @returns {String}
                 */
                getBaseUrl: function(url) {
                    var hashIndex = url.indexOf('#');
                    return hashIndex === -1 ? url.slice(0) : url.slice(0, hashIndex);
                },
                /**
                 * 把一个字符串的 url 转为一个可获取其 base 和 fragment 等的对象
                 *
                 * @param {String} url url
                 * @returns {UrlObject}
                 */
                toUrlObject: function(url) {
                    var fullUrl = this.getAbsoluteUrl(url),
                        baseUrl = this.getBaseUrl(fullUrl),
                        fragment = this.getUrlFragment(url);

                    return {
                        base: baseUrl,
                        full: fullUrl,
                        original: url,
                        fragment: fragment
                    };
                },
                /**
                 * 判断浏览器是否支持 sessionStorage，支持返回 true，否则返回 false
                 * @returns {Boolean}
                 */
                supportStorage: function() {
                    var mod = 'fly.router.storage.ability';
                    try {
                        sessionStorage.setItem(mod, mod);
                        sessionStorage.removeItem(mod);
                        return true;
                    } catch (e) {
                        return false;
                    }
                }
            };

            var routerConfig = {
                sectionGroupClass: 'page-group',
                // 表示是当前 page 的 class
                curPageClass: 'page-current',
                // 用来辅助切换时表示 page 是 visible 的,
                // 之所以不用 curPageClass，是因为 page-current 已被赋予了「当前 page」这一含义而不仅仅是 display: block
                // 并且，别的地方已经使用了，所以不方便做变更，故新增一个
                visiblePageClass: 'page-visible',
                // 表示是 page 的 class，注意，仅是标志 class，而不是所有的 class
                pageClass: 'page'
            };

            var DIRECTION = {
                leftToRight: 'from-left-to-right',
                rightToLeft: 'from-right-to-left'
            };

            var theHistory = window.history;

            var Router = function() {
                this.sessionNames = {
                    currentState: 'fly.router.currentState',
                    maxStateId: 'fly.router.maxStateId'
                };

                this._init();
                this.xhr = null;
                window.addEventListener('popstate', this._onPopState.bind(this));
            };

            /**
             * 初始化
             *
             * - 把当前文档内容缓存起来
             * - 查找默认展示的块内容，查找顺序如下
             *      1. id 是 url 中的 fragment 的元素
             *      2. 有当前块 class 标识的第一个元素
             *      3. 第一个块
             * - 初始页面 state 处理
             *
             * @private
             */
            Router.prototype._init = function() {

                this.$view = $('body');

                // 用来保存 document 的 map
                this.cache = {};
                var $doc = $(document);
                var currentUrl = location.href;
                this._saveDocumentIntoCache($doc, currentUrl);

                var curPageId;

                var currentUrlObj = Util.toUrlObject(currentUrl);
                var $allSection = $doc.find('.' + routerConfig.pageClass);
                var $visibleSection = $doc.find('.' + routerConfig.curPageClass);
                var $curVisibleSection = $visibleSection.eq(0);
                var $hashSection;

                if (currentUrlObj.fragment) {
                    $hashSection = $doc.find('#' + currentUrlObj.fragment);
                }
                if ($hashSection && $hashSection.length) {
                    $visibleSection = $hashSection.eq(0);
                } else if (!$visibleSection.length) {
                    $visibleSection = $allSection.eq(0);
                }
                if (!$visibleSection.attr('id')) {
                    $visibleSection.attr('id', this._generateRandomId());
                }

                if ($curVisibleSection.length &&
                    ($curVisibleSection.attr('id') !== $visibleSection.attr('id'))) {
                    // 在 router 到 inner page 的情况下，刷新（或者直接访问该链接）
                    // 直接切换 class 会有「闪」的现象,或许可以采用 animateSection 来减缓一下
                    $curVisibleSection.removeClass(routerConfig.curPageClass);
                    $visibleSection.addClass(routerConfig.curPageClass);
                } else {
                    $visibleSection.addClass(routerConfig.curPageClass);
                }
                curPageId = $visibleSection.attr('id');


                // 新进入一个使用 history.state 相关技术的页面时，如果第一个 state 不 push/replace,
                // 那么在后退回该页面时，将不触发 popState 事件
                if (theHistory.state === null) {
                    var curState = {
                        id: this._getNextStateId(),
                        url: Util.toUrlObject(currentUrl),
                        pageId: curPageId
                    };

                    theHistory.replaceState(curState, '', currentUrl);
                    this._saveAsCurrentState(curState);
                    this._incMaxStateId();
                }
            };

            /**
             * 切换到 url 指定的块或文档
             *
             * 如果 url 指向的是当前页面，那么认为是切换块；
             * 否则是切换文档
             *
             * @param {String} url url
             * @param {Boolean=} ignoreCache 是否强制请求不使用缓存，对 document 生效，默认是 false
             */
            Router.prototype.load = function(url, ignoreCache) {
                if (ignoreCache === undefined) {
                    ignoreCache = false;
                }

                if (this._isTheSameDocument(location.href, url)) {
                    this._switchToSection(Util.getUrlFragment(url));
                } else {
                    this._saveDocumentIntoCache($(document), location.href);
                    this._switchToDocument(url, ignoreCache);
                }
            };

            /**
             * 调用 history.forward()
             */
            Router.prototype.forward = function() {
                theHistory.forward();
            };

            /**
             * 调用 history.back()
             */
            Router.prototype.back = function() {
                theHistory.back();
            };

            //noinspection JSUnusedGlobalSymbols
            /**
             * @deprecated
             */
            Router.prototype.loadPage = Router.prototype.load;

            /**
             * 切换显示当前文档另一个块
             *
             * 把新块从右边切入展示，同时会把新的块的记录用 history.pushState 来保存起来
             *
             * 如果已经是当前显示的块，那么不做任何处理；
             * 如果没对应的块，那么忽略。
             *
             * @param {String} sectionId 待切换显示的块的 id
             * @private
             */
            Router.prototype._switchToSection = function(sectionId) {
                if (!sectionId) {
                    return;
                }

                var $curPage = this._getCurrentSection(),
                    $newPage = $('#' + sectionId);

                // 如果已经是当前页，不做任何处理
                if ($curPage === $newPage) {
                    return;
                }

                this._animateSection($curPage, $newPage, DIRECTION.rightToLeft);
                this._pushNewState('#' + sectionId, sectionId);
            };

            /**
             * 载入显示一个新的文档
             *
             * - 如果有缓存，那么直接利用缓存来切换
             * - 否则，先把页面加载过来缓存，然后再切换
             *      - 如果解析失败，那么用 location.href 的方式来跳转
             *
             * 注意：不能在这里以及其之后用 location.href 来 **读取** 切换前的页面的 url，
             *     因为如果是 popState 时的调用，那么此时 location 已经是 pop 出来的 state 的了
             *
             * @param {String} url 新的文档的 url
             * @param {Boolean=} ignoreCache 是否不使用缓存强制加载页面
             * @param {Boolean=} isPushState 是否需要 pushState
             * @param {String=} direction 新文档切入的方向
             * @private
             */
            Router.prototype._switchToDocument = function(url, ignoreCache, isPushState, direction) {
                var baseUrl = Util.toUrlObject(url).base;

                if (ignoreCache) {
                    delete this.cache[baseUrl];
                }

                var cacheDocument = this.cache[baseUrl];
                var context = this;

                if (cacheDocument) {
                    this._doSwitchDocument(url, isPushState, direction);
                } else {
                    this._loadDocument(url, {
                        success: function($doc) {
                            try {
                                context._parseDocument(url, $doc);
                                context._doSwitchDocument(url, isPushState, direction);
                            } catch (e) {
                                location.href = url;
                            }
                        },
                        error: function() {
                            location.href = url;
                        }
                    });
                }
            };

            /**
             * 利用缓存来做具体的切换文档操作
             *
             * - 确定待切入的文档的默认展示 section
             * - 把新文档 append 到 view 中
             * - 动画切换文档
             * - 如果需要 pushState，那么把最新的状态 push 进去并把当前状态更新为该状态
             *
             * @param {String} url 待切换的文档的 url
             * @param {Boolean} isPushState 加载页面后是否需要 pushState，默认是 true
             * @param {String} direction 动画切换方向，默认是 DIRECTION.rightToLeft
             * @private
             */
            Router.prototype._doSwitchDocument = function(url, isPushState, direction) {
                if (typeof isPushState === 'undefined') {
                    isPushState = true;
                }

                var urlObj = Util.toUrlObject(url);
                var $currentDoc = this.$view.find('.' + routerConfig.sectionGroupClass);
                var $newDoc = $($('<div></div>').append(this.cache[urlObj.base].$content).html());

                // 确定一个 document 展示 section 的顺序
                // 1. 与 hash 关联的 element
                // 2. 默认的标识为 current 的 element
                // 3. 第一个 section
                var $allSection = $newDoc.find('.' + routerConfig.pageClass);
                var $visibleSection = $newDoc.find('.' + routerConfig.curPageClass);
                var $hashSection;

                if (urlObj.fragment) {
                    $hashSection = $newDoc.find('#' + urlObj.fragment);
                }
                if ($hashSection && $hashSection.length) {
                    $visibleSection = $hashSection.eq(0);
                } else if (!$visibleSection.length) {
                    $visibleSection = $allSection.eq(0);
                }
                if (!$visibleSection.attr('id')) {
                    $visibleSection.attr('id', this._generateRandomId());
                }

                var $currentSection = this._getCurrentSection();
                $currentSection.trigger(EVENTS.beforePageSwitch, [$currentSection.attr('id'), $currentSection]);

                $allSection.removeClass(routerConfig.curPageClass);
                $visibleSection.addClass(routerConfig.curPageClass);

                // prepend 而不 append 的目的是避免 append 进去新的 document 在后面，
                // 其里面的默认展示的(.page-current) 的页面直接就覆盖了原显示的页面（因为都是 absolute）
                this.$view.prepend($newDoc);

                this._animateDocument($currentDoc, $newDoc, $visibleSection, direction);

                if (isPushState) {
                    this._pushNewState(url, $visibleSection.attr('id'));
                }
            };

            /**
             * 判断两个 url 指向的页面是否是同一个
             *
             * 判断方式: 如果两个 url 的 base 形式（不带 hash 的绝对形式）相同，那么认为是同一个页面
             *
             * @param {String} url
             * @param {String} anotherUrl
             * @returns {Boolean}
             * @private
             */
            Router.prototype._isTheSameDocument = function(url, anotherUrl) {
                return Util.toUrlObject(url).base === Util.toUrlObject(anotherUrl).base;
            };

            /**
             * ajax 加载 url 指定的页面内容
             *
             * 加载过程中会发出以下事件
             *  pageLoadCancel: 如果前一个还没加载完,那么取消并发送该事件
             *  pageLoadStart: 开始加载
             *  pageLodComplete: ajax complete 完成
             *  pageLoadError: ajax 发生 error
             *
             *
             * @param {String} url url
             * @param {Object=} callback 回调函数配置，可选，可以配置 success\error 和 complete
             *      所有回调函数的 this 都是 null，各自实参如下：
             *      success: $doc, status, xhr
             *      error: xhr, status, err
             *      complete: xhr, status
             *
             * @private
             */
            Router.prototype._loadDocument = function(url, callback) {
                if (this.xhr && this.xhr.readyState < 4) {
                    this.xhr.onreadystatechange = function() {};
                    this.xhr.abort();
                    this.dispatch(EVENTS.pageLoadCancel);
                }

                this.dispatch(EVENTS.pageLoadStart);

                callback = callback || {};
                var self = this;

                this.xhr = $.ajax({
                    url: url,
                    success: $.proxy(function(data, status, xhr) {
                        // 给包一层 <html/>，从而可以拿到完整的结构
                        var $doc = $('<html></html>');
                        $doc.append(data);
                        callback.success && callback.success.call(null, $doc, status, xhr);
                    }, this),
                    error: function(xhr, status, err) {
                        callback.error && callback.error.call(null, xhr, status, err);
                        self.dispatch(EVENTS.pageLoadError);
                    },
                    complete: function(xhr, status) {
                        callback.complete && callback.complete.call(null, xhr, status);
                        self.dispatch(EVENTS.pageLoadComplete);
                    }
                });
            };

            /**
             * 对于 ajax 加载进来的页面，把其缓存起来
             *
             * @param {String} url url
             * @param $doc ajax 载入的页面的 jq 对象，可以看做是该页面的 $(document)
             * @private
             */
            Router.prototype._parseDocument = function(url, $doc) {
                var $innerView = $doc.find('.' + routerConfig.sectionGroupClass);

                if (!$innerView.length) {
                    throw new Error('missing router view mark: ' + routerConfig.sectionGroupClass);
                }

                this._saveDocumentIntoCache($doc, url);
            };

            /**
             * 把一个页面的相关信息保存到 this.cache 中
             *
             * 以页面的 baseUrl 为 key,而 value 则是一个 DocumentCache
             *
             * @param {*} doc doc
             * @param {String} url url
             * @private
             */
            Router.prototype._saveDocumentIntoCache = function(doc, url) {
                var urlAsKey = Util.toUrlObject(url).base;
                var $doc = $(doc);

                this.cache[urlAsKey] = {
                    $doc: $doc,
                    $content: $doc.find('.' + routerConfig.sectionGroupClass)
                };
            };

            /**
             * 从 sessionStorage 中获取保存下来的「当前状态」
             *
             * 如果解析失败，那么认为当前状态是 null
             *
             * @returns {State|null}
             * @private
             */
            Router.prototype._getLastState = function() {
                var currentState = sessionStorage.getItem(this.sessionNames.currentState);
                try {
                    currentState = JSON.parse(currentState);
                } catch (e) {
                    currentState = null;
                }

                return currentState;
            };

            /**
             * 把一个状态设为当前状态，保存仅 sessionStorage 中
             *
             * @param {State} state
             * @private
             */
            Router.prototype._saveAsCurrentState = function(state) {
                sessionStorage.setItem(this.sessionNames.currentState, JSON.stringify(state));
            };

            /**
             * 获取下一个 state 的 id
             *
             * 读取 sessionStorage 里的最后的状态的 id，然后 + 1；如果原没设置，那么返回 1
             *
             * @returns {number}
             * @private
             */
            Router.prototype._getNextStateId = function() {
                var maxStateId = sessionStorage.getItem(this.sessionNames.maxStateId);
                return maxStateId ? parseInt(maxStateId, 10) + 1 : 1;
            };

            /**
             * 把 sessionStorage 里的最后状态的 id 自加 1
             *
             * @private
             */
            Router.prototype._incMaxStateId = function() {
                sessionStorage.setItem(this.sessionNames.maxStateId, this._getNextStateId());
            };

            /**
             * 从一个文档切换为显示另一个文档
             *
             * @param $from 目前显示的文档
             * @param $to 待切换显示的新文档
             * @param $visibleSection 新文档中展示的 section 元素
             * @param direction 新文档切入方向
             * @private
             */
            Router.prototype._animateDocument = function($from, $to, $visibleSection, direction) {
                var sectionId = $visibleSection.attr('id');


                var $visibleSectionInFrom = $from.find('.' + routerConfig.curPageClass);
                $visibleSectionInFrom.addClass(routerConfig.visiblePageClass).removeClass(routerConfig.curPageClass);

                $visibleSection.trigger(EVENTS.pageAnimationStart, [sectionId, $visibleSection]);

                this._animateElement($from, $to, direction);

                $from.animationEnd(function() {
                    $visibleSectionInFrom.removeClass(routerConfig.visiblePageClass);
                    // 移除 document 前后，发送 beforePageRemove 和 pageRemoved 事件
                    $(window).trigger(EVENTS.beforePageRemove, [$from]);
                    $from.remove();
                    $(window).trigger(EVENTS.pageRemoved);
                });

                $to.animationEnd(function() {
                    $visibleSection.trigger(EVENTS.pageAnimationEnd, [sectionId, $visibleSection]);
                    // 外层（init.js）中会绑定 pageInitInternal 事件，然后对页面进行初始化
                    $visibleSection.trigger(EVENTS.pageInit, [sectionId, $visibleSection]);
                });
            };

            /**
             * 把当前文档的展示 section 从一个 section 切换到另一个 section
             *
             * @param $from
             * @param $to
             * @param direction
             * @private
             */
            Router.prototype._animateSection = function($from, $to, direction) {
                var toId = $to.attr('id');
                $from.trigger(EVENTS.beforePageSwitch, [$from.attr('id'), $from]);

                $from.removeClass(routerConfig.curPageClass);
                $to.addClass(routerConfig.curPageClass);
                $to.trigger(EVENTS.pageAnimationStart, [toId, $to]);
                this._animateElement($from, $to, direction);
                $to.animationEnd(function() {
                    $to.trigger(EVENTS.pageAnimationEnd, [toId, $to]);
                    // 外层（init.js）中会绑定 pageInitInternal 事件，然后对页面进行初始化
                    $to.trigger(EVENTS.pageInit, [toId, $to]);
                });
            };

            /**
             * 切换显示两个元素
             *
             * 切换是通过更新 class 来实现的，而具体的切换动画则是 class 关联的 css 来实现
             *
             * @param $from 当前显示的元素
             * @param $to 待显示的元素
             * @param direction 切换的方向
             * @private
             */
            Router.prototype._animateElement = function($from, $to, direction) {
                // todo: 可考虑如果入参不指定，那么尝试读取 $to 的属性，再没有再使用默认的
                // 考虑读取点击的链接上指定的方向
                if (typeof direction === 'undefined') {
                    direction = DIRECTION.rightToLeft;
                }

                var animPageClasses = [
                    'page-from-center-to-left',
                    'page-from-center-to-right',
                    'page-from-right-to-center',
                    'page-from-left-to-center'
                ].join(' ');

                var classForFrom, classForTo;
                switch (direction) {
                    case DIRECTION.rightToLeft:
                        classForFrom = 'page-from-center-to-left';
                        classForTo = 'page-from-right-to-center';
                        break;
                    case DIRECTION.leftToRight:
                        classForFrom = 'page-from-center-to-right';
                        classForTo = 'page-from-left-to-center';
                        break;
                    default:
                        classForFrom = 'page-from-center-to-left';
                        classForTo = 'page-from-right-to-center';
                        break;
                }

                $from.removeClass(animPageClasses).addClass(classForFrom);
                $to.removeClass(animPageClasses).addClass(classForTo);

                $from.animationEnd(function() {
                    $from.removeClass(animPageClasses);
                });
                $to.animationEnd(function() {
                    $to.removeClass(animPageClasses);
                });
            };

            /**
             * 获取当前显示的第一个 section
             *
             * @returns {*}
             * @private
             */
            Router.prototype._getCurrentSection = function() {
                return this.$view.find('.' + routerConfig.curPageClass).eq(0);
            };

            /**
             * popState 事件关联着的后退处理
             *
             * 判断两个 state 判断是否是属于同一个文档，然后做对应的 section 或文档切换；
             * 同时在切换后把新 state 设为当前 state
             *
             * @param {State} state 新 state
             * @param {State} fromState 旧 state
             * @private
             */
            Router.prototype._back = function(state, fromState) {
                if (this._isTheSameDocument(state.url.full, fromState.url.full)) {
                    var $newPage = $('#' + state.pageId);
                    if ($newPage.length) {
                        var $currentPage = this._getCurrentSection();
                        this._animateSection($currentPage, $newPage, DIRECTION.leftToRight);
                        this._saveAsCurrentState(state);
                    } else {
                        location.href = state.url.full;
                    }
                } else {
                    this._saveDocumentIntoCache($(document), fromState.url.full);
                    this._switchToDocument(state.url.full, false, false, DIRECTION.leftToRight);
                    this._saveAsCurrentState(state);
                }
            };

            /**
             * popState 事件关联着的前进处理,类似于 _back，不同的是切换方向
             *
             * @param {State} state 新 state
             * @param {State} fromState 旧 state
             * @private
             */
            Router.prototype._forward = function(state, fromState) {
                if (this._isTheSameDocument(state.url.full, fromState.url.full)) {
                    var $newPage = $('#' + state.pageId);
                    if ($newPage.length) {
                        var $currentPage = this._getCurrentSection();
                        this._animateSection($currentPage, $newPage, DIRECTION.rightToLeft);
                        this._saveAsCurrentState(state);
                    } else {
                        location.href = state.url.full;
                    }
                } else {
                    this._saveDocumentIntoCache($(document), fromState.url.full);
                    this._switchToDocument(state.url.full, false, false, DIRECTION.rightToLeft);
                    this._saveAsCurrentState(state);
                }
            };

            /**
             * popState 事件处理
             *
             * 根据 pop 出来的 state 和当前 state 来判断是前进还是后退
             *
             * @param event
             * @private
             */
            Router.prototype._onPopState = function(event) {
                var state = event.state;
                // if not a valid state, do nothing
                if (!state || !state.pageId) {
                    return;
                }

                var lastState = this._getLastState();

                if (!lastState) {
                    console.error && console.error('Missing last state when backward or forward');
                    return;
                }

                if (state.id === lastState.id) {
                    return;
                }

                if (state.id < lastState.id) {
                    this._back(state, lastState);
                } else {
                    this._forward(state, lastState);
                }
            };

            /**
             * 页面进入到一个新状态
             *
             * 把新状态 push 进去，设置为当前的状态，然后把 maxState 的 id +1。
             *
             * @param {String} url 新状态的 url
             * @param {String} sectionId 新状态中显示的 section 元素的 id
             * @private
             */
            Router.prototype._pushNewState = function(url, sectionId) {
                var state = {
                    id: this._getNextStateId(),
                    pageId: sectionId,
                    url: Util.toUrlObject(url)
                };

                theHistory.pushState(state, '', url);
                this._saveAsCurrentState(state);
                this._incMaxStateId();
            };

            /**
             * 生成一个随机的 id
             *
             * @returns {string}
             * @private
             */
            Router.prototype._generateRandomId = function() {
                return "page-" + (+new Date());
            };

            Router.prototype.dispatch = function(event) {
                var e = new CustomEvent(event, {
                    bubbles: true,
                    cancelable: true
                });

                //noinspection JSUnresolvedFunction
                window.dispatchEvent(e);
            };

            /**
             * 判断一个链接是否使用 router 来处理
             *
             * @param $link
             * @returns {boolean}
             */
            function isInRouterBlackList($link) {
                var classBlackList = [
                    'external',
                    'tab-link',
                    'open-popup',
                    'close-popup',
                    'open-panel',
                    'close-panel'
                ];

                for (var i = classBlackList.length - 1; i >= 0; i--) {
                    if ($link.hasClass(classBlackList[i])) {
                        return true;
                    }
                }

                var linkEle = $link.get(0);
                var linkHref = linkEle.getAttribute('href');

                var protoWhiteList = [
                    'http',
                    'https'
                ];

                //如果非noscheme形式的链接，且协议不是http(s)，那么路由不会处理这类链接
                if (/^(\w+):/.test(linkHref) && protoWhiteList.indexOf(RegExp.$1) < 0) {
                    return true;
                }

                //noinspection RedundantIfStatementJS
                if (linkEle.hasAttribute('external')) {
                    return true;
                }

                return false;
            }

            /**
             * 自定义是否执行路由功能的过滤器
             *
             * 可以在外部定义 $.config.routerFilter 函数，实参是点击链接的 Zepto 对象。
             *
             * @param $link 当前点击的链接的 Zepto 对象
             * @returns {boolean} 返回 true 表示执行路由功能，否则不做路由处理
             */
            function customClickFilter($link) {
                var customRouterFilter = fly.config.router.filter;
                if ($.isFunction(customRouterFilter)) {
                    var filterResult = customRouterFilter($link);
                    if (typeof filterResult === 'boolean') {
                        return filterResult;
                    }
                }

                return true;
            }

            $(function() {
                // 用户可选关闭router功能
                if (fly.config.router.disabled) {
                    return;
                }

                if (!Util.supportStorage()) {
                    return;
                }

                var $pages = $('.' + routerConfig.pageClass);
                if (!$pages.length) {
                    var warnMsg = 'Disable router function because of no .page elements';
                    if (window.console && window.console.warn) {
                        console.warn(warnMsg);
                    }
                    return;
                }

                var router = fly.router = new Router();

                $(document).on('click', 'a', function(e) {
                    var $target = $(e.currentTarget);

                    var filterResult = customClickFilter($target);
                    if (!filterResult) {
                        return;
                    }

                    if (isInRouterBlackList($target)) {
                        return;
                    }

                    e.preventDefault();

                    if ($target.hasClass('back')) {
                        router.back();
                    } else {
                        var url = $target.attr('href');
                        if (!url || url === '#') {
                            return;
                        }

                        var ignoreCache = $target.attr('data-no-cache') === 'true';

                        router.load(url, ignoreCache);
                    }
                });
            });
        }, {
            './Core': 3
        }
    ],
    3: [ // Core
        
        function(require, module, exports) {
            if (typeof $ === "undefined")
                throw new Error("框架依赖Zepto");

            var fly = {
                VERSION: "0.1.0",
                RELEASE: "2016-11-16",
                config: {
                    router: {
                        disabled : true, // 禁用路由
                        filter : undefined //  路由功能的过滤器
                    }
                },
                CacheData: {}, 
                uuid: 0,
                hooks : {}
            }
            

            if (typeof window.CustomEvent === 'undefined') {
                function CustomEvent(event, params) {
                    params = params || {
                        bubbles: false,
                        cancelable: false,
                        detail: undefined
                    };
                    var evt = document.createEvent('Events');
                    var bubbles = true;
                    for (var name in params) {
                        (name === 'bubbles') ? (bubbles = !!params[name]) : (evt[name] = params[name]);
                    }
                    evt.initEvent(event, bubbles, true);
                    return evt;
                };
                CustomEvent.prototype = window.Event.prototype;
                window.CustomEvent = CustomEvent;
            }

            module.exports = fly;

            window.fly = fly;

            if (typeof define === "function" && define.amd) {
                define("fly", [], function() {
                    return fly;
                });
            }
        }, {}
    ],
    4: [ // Slider
        
        function(require, module, exports) {

            var fly = require('./Core'),
                Utils = require('./Utils'),
                Scroll = require('./Scroll');

            var CLASS_SLIDER = 'ui-slider';
            var CLASS_SLIDER_GROUP = 'ui-slider-group';
            var CLASS_SLIDER_INDICATOR = 'ui-slider-indicator';
            var CLASS_ACTION_PREVIOUS = 'ui-action-previous';
            var CLASS_ACTION_NEXT = 'ui-action-next';
            var CLASS_SLIDER_ITEM = 'ui-slider-item';
            var CLALSS_SLIDER_PROGRESS_BAR = 'ui-slider-progress-bar';

            var CLASS_ACTIVE = 'ui-active';

            var SELECTOR_SLIDER_ITEM = '.' + CLASS_SLIDER_ITEM;
            var SELECTOR_SLIDER_INDICATOR = '.' + CLASS_SLIDER_INDICATOR;

            var Slider = fly.Slider = Scroll.extend({
                init: function(element, options) {
                    this._super(element, $.extend(true, {
                        fingers: 1,
                        interval: 0, //设置为0，则不会定时轮播
                        scrollY: false,
                        scrollX: false,
                        indicators: false,
                        scrollTime: 1000,
                        startX: 0,
                        slideTime: 0, //滑动动画时间
                        snap: SELECTOR_SLIDER_ITEM,
                        progressBar: false
                    }, options));
                    
                },
                _init: function() {
                    this._reInit();
                    if (this.scroller) {
                        this.scrollerStyle = this.scroller.style;
                        if(this.options.progressBar) {
                            var progressBar = document.createElement('div');
                            progressBar.className = CLALSS_SLIDER_PROGRESS_BAR;
                            this.wrapper.appendChild(progressBar);
                            this.progressBar = progressBar;   
                            this.progressBarStyle = this.progressBar.style;
                        }

                        this._super();
                        this._initTimer();
                    }
                },
                _triggerSlide: function() {
                    var self = this;
                    self.isInTransition = false;
                    var page = self.currentPage;
                    self.slideNumber = self._fixedSlideNumber();

                    if (self.lastSlideNumber != self.slideNumber) {
                        self.lastSlideNumber = self.slideNumber;
                        self.lastPage = self.currentPage;
                        Utils.trigger(self.wrapper, 'slide', {
                            slideNumber: self.slideNumber
                        });
                    }
                },
                _handleSlide: function(e) {
                    var self = this;
                    if (e.target !== self.wrapper) {
                        return;
                    }
                    var detail = e.detail;
                    detail.slideNumber = detail.slideNumber || 0;
                    var temps = self.scroller.querySelectorAll(SELECTOR_SLIDER_ITEM);
                    var items = [];
                    for (var i = 0, len = temps.length; i < len; i++) {
                        var item = temps[i];
                        if (item.parentNode === self.scroller) {
                            items.push(item);
                        }
                    }
                    var _slideNumber = detail.slideNumber;

                    if (!self.wrapper.classList.contains('ui-segmented-control')) {
                        for (var i = 0, len = items.length; i < len; i++) {
                            var item = items[i];
                            if (item.parentNode === self.scroller) {
                                if (i === _slideNumber) {
                                    item.classList.add(CLASS_ACTIVE);
                                } else {
                                    item.classList.remove(CLASS_ACTIVE);
                                }
                            }
                        }
                    }
                    var indicatorWrap = self.wrapper.querySelector('.ui-slider-indicator');
                    if (indicatorWrap) {
                        if (indicatorWrap.getAttribute('data-scroll')) { //scroll
                            $(indicatorWrap).scroll().gotoPage(detail.slideNumber);
                        }
                        var indicators = indicatorWrap.querySelectorAll('.ui-indicator');
                        if (indicators.length > 0) { //图片轮播
                            for (var i = 0, len = indicators.length; i < len; i++) {
                                indicators[i].classList[i === detail.slideNumber ? 'add' : 'remove'](CLASS_ACTIVE);
                            }
                        } else {
                            var number = indicatorWrap.querySelector('.ui-number span');
                            if (number) { //图文表格
                                number.innerText = (detail.slideNumber + 1);
                            } else { //segmented controls
                                var controlItems = indicatorWrap.querySelectorAll('.ui-control-item');
                                for (var i = 0, len = controlItems.length; i < len; i++) {
                                    controlItems[i].classList[i === detail.slideNumber ? 'add' : 'remove'](CLASS_ACTIVE);
                                }
                            }
                        }
                    }
                    e.stopPropagation();
                },
                _handleTabShow: function(e) {
                    var self = this;
                    self.gotoItem((e.detail.tabNumber || 0), self.options.slideTime);
                },
                _handleIndicatorTap: function(event) {
                    var self = this;
                    var target = event.target;
                    if (target.classList.contains(CLASS_ACTION_PREVIOUS) || target.classList.contains(CLASS_ACTION_NEXT)) {
                        self[target.classList.contains(CLASS_ACTION_PREVIOUS) ? 'prevItem' : 'nextItem']();
                        event.stopPropagation();
                    }
                },
                _initEvent: function(detach) {
                    var self = this;
                    self._super(detach);
                    var action = detach ? 'removeEventListener' : 'addEventListener';
                    self.wrapper[action]('slide', this);
                },
                handleEvent: function(e) {
                    this._super(e);
                    switch (e.type) {
                        case 'slide':
                            this._handleSlide(e);
                            break;
                    }
                },
                _scrollend: function(e) {
                    this._super(e);
                    this._triggerSlide(e);
                },
                _drag: function(e) {
                    this._super(e);
                    var direction = e.detail.direction;
                    if (direction === 'left' || direction === 'right') {
                        //拖拽期间取消定时
                        var slidershowTimer = this.wrapper.getAttribute('data-slidershowTimer');
                        slidershowTimer && window.clearTimeout(slidershowTimer);

                        e.stopPropagation();
                    }
                },
                _initTimer: function() {
                    var self = this;
                    var slider = self.wrapper;
                    var interval = self.options.interval;
                    var slidershowTimer = slider.getAttribute('data-slidershowTimer');
                    slidershowTimer && window.clearTimeout(slidershowTimer);
                    if (interval) {
                        slidershowTimer = window.setTimeout(function() {
                            if (!slider) {
                                return;
                            }
                            //仅slider显示状态进行自动轮播
                            if (!!(slider.offsetWidth || slider.offsetHeight)) {
                                self.nextItem(true);
                                //下一个
                            }
                            self._initTimer();
                        }, interval);
                        slider.setAttribute('data-slidershowTimer', slidershowTimer);
                    }
                },

                _fixedSlideNumber: function(page) {
                    page = page || this.currentPage;
                    var slideNumber = page.pageX;
                    return slideNumber;
                },
                _reLayout: function() {
                    this.hasHorizontalScroll = true;
                    this._super();
                },
                _getScroll: function() {
                    var result = Utils.parseTranslateMatrix(Utils.getStyles(this.scroller, 'webkitTransform'));
                    return result ? result.x : 0;
                },
                _transitionEnd: function(e) {
                    if (e.target !== this.scroller || !this.isInTransition) {
                        return;
                    }
                    this._transitionTime();
                    this.isInTransition = false;
                    Utils.trigger(this.wrapper, 'scrollend', this);
                },
                _flick: function(e) {
                    if (!this.moved) { //无moved
                        return;
                    }
                    var detail = e.detail;
                    var direction = detail.direction;
                    this._clearRequestAnimationFrame();
                    this.isInTransition = true;
                    if (e.type === 'flick') {
                        this.x = this._getPage((this.slideNumber + (direction === 'right' ? -1 : 1)), true).x;
                        this.resetPosition(this.options.bounceTime);
                    } else if (e.type === 'dragend' && !detail.flick) {
                        this.resetPosition(this.options.bounceTime);
                    }
                    e.stopPropagation();
                    this._initTimer();
                },
                _initSnap: function() {
                    this.scrollerWidth = this.itemLength * this.scrollerWidth;
                    this.maxScrollX = Math.min(this.wrapperWidth - this.scrollerWidth, 0);
                    this._super(); 
                    if (!this.currentPage.x) {
                        var currentPage = this.pages[0];
                        if (!currentPage) {
                            return;
                        }
                        this.currentPage = currentPage[0];
                        this.slideNumber = 0;
                        this.lastSlideNumber = typeof this.lastSlideNumber === 'undefined' ? 0 : this.lastSlideNumber;
                    } else {
                        this.slideNumber = this._fixedSlideNumber();
                        this.lastSlideNumber = typeof this.lastSlideNumber === 'undefined' ? this.slideNumber : this.lastSlideNumber;
                    }
                    this.options.startX = this.currentPage.x || 0;
                },
                _getSnapX: function(offsetLeft) {
                    return Math.max(-offsetLeft, this.maxScrollX);
                },
                _getPage: function(slideNumber) {
                    if (slideNumber > (this.itemLength - 1)) {
                        slideNumber = 0 ;
                    } 
                    if ( slideNumber < 0) {
                        slideNumber = 0;
                    } 
                    
                    return this.pages[slideNumber][0];
                },
                _gotoItem: function(slideNumber) {
                    this.currentPage = this._getPage(slideNumber, true);
                    this.scrollTo(this.currentPage.x, 0, this.options.scrollTime, this.options.scrollEasing);

                    Utils.trigger(this.wrapper, 'scrollend', this);

                },
                //API
                setTranslate: function(x, y) {
                    this._super(x, y);
                    var progressBar = this.progressBar;
                    var i = this.currentPage.pageX,
                        itmesLength = this.itemLength;
                    if (progressBar) {
                       this.progressBarStyle.webkitTransform = this._getTranslateStr(this.wrapperWidth * i / itmesLength, 0);
                    }
                },
                resetPosition: function(time) {
                    time = time || 0;
                    if (this.x > 0) {
                        this.x = 0;
                    } else if (this.x < this.maxScrollX) {
                        this.x = this.maxScrollX;
                    }
                    this.currentPage = this._nearestSnap(this.x);
                    this.scrollTo(this.currentPage.x, 0, time, this.options.scrollEasing);
                    return true;
                },
                gotoItem: function(slideNumber) {
                    this._gotoItem(slideNumber);
                },
                nextItem: function() {
                    this._gotoItem(this.slideNumber + 1);
                },
                prevItem: function() {
                    this._gotoItem(this.slideNumber - 1);
                },
                getSlideNumber: function() {
                    return this.slideNumber || 0;
                },
                _reInit: function() {
                    
                },
                refresh: function(options) {
                    if (options) {
                        $.extend(this.options, options);
                        this._super();
                        this._initTimer();
                    } else {
                        this._super();
                    }
                },
                destroy: function() {
                    this._initEvent(true); //detach
                    delete fly.CacheData[this.wrapper.getAttribute('data-slider')];
                    this.wrapper.setAttribute('data-slider', '');
                }
            });
            $.fn.slider = function(options) {
                var slider = null;
                this.each(function() {
                    var sliderElement = this;
                    if (!this.classList.contains(CLASS_SLIDER)) {
                        sliderElement = this.querySelector('.' + CLASS_SLIDER);
                    }
                    if (sliderElement && sliderElement.querySelector(SELECTOR_SLIDER_ITEM)) {
                        var id = sliderElement.getAttribute('data-slider');
                        if (!id) {
                            id = ++fly.uuid;
                            fly.CacheData[id] = slider = new Slider(sliderElement, options);
                            sliderElement.setAttribute('data-slider', id);
                        } else {
                            slider = fly.CacheData[id];
                            if (slider && options) {
                                slider.refresh(options);
                            }
                        }
                    }
                });
                return slider;
            };  
           
        }, {
            './Core': 3,
            './Utils': 5,
            './Scroll': 11
        }
    ],
    5: [ // Utils
        
        function(require, module, exports) {
            var fly = require('./Core');

            var Utils = {
                isArray: (Array.isArray || function(object) {
                    return object instanceof Array;
                }),
                queryString: function(queryStr) {
                    var _queryStr = queryStr || location.search;
                    var search = _queryStr.replace(/^\s+/, '').replace(/\s+$/, '').match(/([^?#]*)(#.*)?$/);
                    if (!search) {
                        return {};
                    }
                    var searchStr = search[1];
                    var searchHash = searchStr.split('&');

                    var ret = {};
                    for (var i = 0, len = searchHash.length; i < len; i++) {
                        var pair = searchHash[i];
                        if ((pair = pair.split('='))[0]) {
                            var key = decodeURIComponent(pair.shift());
                            var value = pair.length > 1 ? pair.join('=') : pair[0];

                            if (value != undefined) {
                                value = decodeURIComponent(value);
                            }
                            if (key in ret) {
                                if (ret[key].constructor != Array) {
                                    ret[key] = [ret[key]];
                                }
                                ret[key].push(value);
                            } else {
                                ret[key] = value;
                            }
                        }
                    }
                    return ret;
                },
                GUID: function() {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                        return v.toString(16);
                    });
                },
                parseTranslateMatrix : function(translateString, position) {
                    var matrix = translateString.match(/matrix(3d)?\((.+?)\)/);
                    var is3D = matrix && matrix[1];
                    if (matrix) {
                        matrix = matrix[2].split(",");
                        if (is3D === "3d")
                            matrix = matrix.slice(12, 15);
                        else {
                            matrix.push(0);
                            matrix = matrix.slice(4, 7);
                        }
                    } else {
                        matrix = [0, 0, 0];
                    }
                    var result = {
                        x: parseFloat(matrix[0]),
                        y: parseFloat(matrix[1]),
                        z: parseFloat(matrix[2])
                    };
                    if (position && result.hasOwnProperty(position)) {
                        return result[position];
                    }
                    return result;
                },
                getStyles : function(element, property) {
                    var styles = element.ownerDocument.defaultView.getComputedStyle(element, null);
                    if (property) {
                        return styles.getPropertyValue(property) || styles[property];
                    }
                    return styles;
                },
                trigger : function(element, eventType, eventData) {
                    element.dispatchEvent(new CustomEvent(eventType, {
                        detail: eventData,
                        bubbles: true,
                        cancelable: true
                    }));
                    return this;
                },
                later : function(fn, when, context, data) {
                    when = when || 0;
                    var m = fn;
                    var d = data;
                    var f;
                    var r;

                    if (typeof fn === 'string') {
                        m = context[fn];
                    }

                    f = function() {
                        m.apply(context, Utils.isArray(d) ? d : [d]);
                    };

                    r = setTimeout(f, when);

                    return {
                        id: r,
                        cancel: function() {
                            clearTimeout(r);
                        }
                    };
                },
                offset : function(element) {
                    var box = {
                        top : 0,
                        left : 0
                    };
                    if ( typeof element.getBoundingClientRect !== undefined) {
                        box = element.getBoundingClientRect();
                    }
                    return {
                        top : box.top + window.pageYOffset - element.clientTop,
                        left : box.left + window.pageXOffset - element.clientLeft
                    };
                }
            }
            module.exports = Utils;
            fly.utils = Utils;
        }, {
            './Core': 3
        }
    ],
    6: [ // Modal
        
        function(require, module, exports) {


            var fly = require('./Core');

            var utils = {
                qsa: function(selector, context) {
                    context = context || document;
                    return [].slice.call(/^\.([\w-]+)$/.test(selector) ? context.getElementsByClassName(RegExp.$1) : /^[\w-]+$/.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector));
                }
            }


            var CLASS_POPUP = 'ui-popup';
            var CLASS_POPUP_BACKDROP = 'ui-popup-backdrop';
            var CLASS_POPUP_IN = 'ui-popup-in';
            var CLASS_POPUP_OUT = 'ui-popup-out';
            var CLASS_POPUP_INNER = 'ui-popup-inner';
            var CLASS_POPUP_TITLE = 'ui-popup-title';
            var CLASS_POPUP_TEXT = 'ui-popup-text';
            var CLASS_POPUP_INPUT = 'ui-popup-input';
            var CLASS_POPUP_BUTTONS = 'ui-popup-buttons';
            var CLASS_POPUP_BUTTON = 'ui-popup-button';
            var CLASS_POPUP_BUTTON_BOLD = 'ui-popup-button-bold';
            var CLASS_ACTIVE = 'ui-active';

            var popupStack = [];
            var backdrop = (function() {
                var element = document.createElement('div');
                element.classList.add(CLASS_POPUP_BACKDROP);
                element.addEventListener('touchmove', function(e) {
                    e.preventDefault();
                });
                element.addEventListener('webkitTransitionEnd', function() {
                    if (!this.classList.contains(CLASS_ACTIVE)) {
                        element.parentNode && element.parentNode.removeChild(element);
                    }
                });
                return element;
            }());

            var createInput = function(placeholder) {
                return '<div class="' + CLASS_POPUP_INPUT + '"><input type="text" autofocus placeholder="' + (placeholder || '') + '"/></div>';
            };
            var createInner = function(message, title, extra) {
                return '<div class="' + CLASS_POPUP_INNER + '"><div class="' + CLASS_POPUP_TITLE + '">' + title + '</div><div class="' + CLASS_POPUP_TEXT + '">' + message.replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>") + '</div>' + (extra || '') + '</div>';
            };
            var createButtons = function(btnArray) {
                var length = btnArray.length;
                var btns = [];
                for (var i = 0; i < length; i++) {
                    btns.push('<span class="' + CLASS_POPUP_BUTTON + (i === length - 1 ? (' ' + CLASS_POPUP_BUTTON_BOLD) : '') + '">' + btnArray[i] + '</span>');
                }
                return '<div class="' + CLASS_POPUP_BUTTONS + '">' + btns.join('') + '</div>';
            };
            var createPopup = function(html, callback, hideBackdrop) {
                var popupElement = document.createElement('div');
                popupElement.className = CLASS_POPUP;
                popupElement.innerHTML = html;
                var removePopupElement = function() {
                    popupElement.parentNode && popupElement.parentNode.removeChild(popupElement);
                    popupElement = null;
                };
                popupElement.addEventListener('touchmove', function(e) {
                    e.preventDefault();
                });
                popupElement.addEventListener('webkitTransitionEnd', function(e) {
                    if (popupElement && e.target === popupElement && popupElement.classList.contains(CLASS_POPUP_OUT)) {
                        removePopupElement();
                    }
                });
                popupElement.style.display = 'block';
                document.body.appendChild(popupElement);
                popupElement.offsetHeight;
                popupElement.classList.add(CLASS_POPUP_IN);

                if (!backdrop.classList.contains(CLASS_ACTIVE) && !hideBackdrop) {
                    backdrop.style.display = 'block';
                    document.body.appendChild(backdrop);
                    backdrop.offsetHeight;
                    backdrop.classList.add(CLASS_ACTIVE);
                }
                var btns = utils.qsa('.' + CLASS_POPUP_BUTTON, popupElement);
                var input = popupElement.querySelector('.' + CLASS_POPUP_INPUT + ' input');
                var popup = {
                    element: popupElement,
                    close: function(index, animate) {
                        if (popupElement) {
                            var result = callback && callback({
                                index: index || 0,
                                value: input && input.value || ''
                            });
                            if (result === false) { //返回false则不关闭当前popup
                                return;
                            }
                            if (animate !== false) {
                                popupElement.classList.remove(CLASS_POPUP_IN);
                                popupElement.classList.add(CLASS_POPUP_OUT);
                            } else {
                                removePopupElement();
                            }
                            popupStack.pop();
                            //如果还有其他popup，则不remove backdrop
                            if (popupStack.length) {
                                popupStack[popupStack.length - 1]['show'](animate);
                            } else {
                                setTimeout(function() {
                                    backdrop.classList.remove(CLASS_ACTIVE);
                                },100)
                                
                            }
                        }
                    }
                };
                var handleEvent = function(e) {
                    popup.close(btns.indexOf(e.target));
                };
                $(popupElement).on('click', '.' + CLASS_POPUP_BUTTON, handleEvent);
                if (popupStack.length) {
                    popupStack[popupStack.length - 1]['hide']();
                }
                popupStack.push({
                    close: popup.close,
                    show: function(animate) {
                        popupElement.style.display = 'block';
                        popupElement.offsetHeight;
                        popupElement.classList.add(CLASS_POPUP_IN);
                    },
                    hide: function() {
                        popupElement.style.display = 'none';
                        popupElement.classList.remove(CLASS_POPUP_IN);
                    }
                });
                return popup;
            };
            var createAlert = function(message, title, btnValue, callback, type) {
                if (typeof message === 'undefined') {
                    return;
                } else {
                    if (typeof title === 'function') {
                        callback = title;
                        type = btnValue;
                        title = null;
                        btnValue = null;
                    } else if (typeof btnValue === 'function') {
                        type = callback;
                        callback = btnValue;
                        btnValue = null;
                    }
                }
               
                return createPopup(createInner(message, title || '') + createButtons([btnValue || '确定']), callback);
                
            };
            var createConfirm = function(message, title, btnArray, callback, type) {
                if (typeof message === 'undefined') {
                    return;
                } else {
                    if (typeof title === 'function') {
                        callback = title;
                        type = btnArray;
                        title = null;
                        btnArray = null;
                    } else if (typeof btnArray === 'function') {
                        type = callback;
                        callback = btnArray;
                        btnArray = null;
                    }
                }
                return createPopup(createInner(message, title || '提示') + createButtons(btnArray || ['取消', '确认']), callback);
            };
            var createPrompt = function(message, placeholder, title, btnArray, callback, type) {
                if (typeof message === 'undefined') {
                    return;
                } else {
                    if (typeof placeholder === 'function') {
                        callback = placeholder;
                        type = title;
                        placeholder = null;
                        title = null;
                        btnArray = null;
                    } else if (typeof title === 'function') {
                        callback = title;
                        type = btnArray;
                        title = null;
                        btnArray = null;
                    } else if (typeof btnArray === 'function') {
                        type = callback;
                        callback = btnArray;
                        btnArray = null;
                    }
                }
                return createPopup(createInner(message, title || '提示', createInput(placeholder)) + createButtons(btnArray || ['取消', '确认']), callback);
            };
            var createToast = function(msg,delay) {
                var toast = document.createElement('div'),
                    text = document.createElement('span');
                toast.className = "ui-toast";
                text.innerHTML = msg || '操作失败';
                toast.appendChild(text);
                document.body.appendChild(toast);
                toast.offsetHeight;
                toast.classList.add(CLASS_ACTIVE);
                timer = setTimeout(function(){
                    toast.classList.remove(CLASS_ACTIVE);
                },(delay ? delay * 1000 : 2000));
                toast.addEventListener('webkitTransitionEnd', function(e) {
                    if (toast && !toast.classList.contains(CLASS_ACTIVE)) {
                        toast.parentNode.removeChild(toast);
                    }
                });
            };
            var creatingLoading = function(showBackdrop) {
                var loadingTpl = '<div class="ui-loading-modal"><span class="ui-loading"></span></div>';
                return createPopup(loadingTpl, function(){}, !showBackdrop);
            };
            var closePopup = function() {
                if (popupStack.length) {
                    popupStack[popupStack.length - 1]['close']();
                    return true;
                } else {
                    return false;
                }
            };
            var closePopups = function() {
                while (popupStack.length) {
                    popupStack[popupStack.length - 1]['close']();
                }
            };

            fly.closePopup = closePopup;
            fly.closePopups = closePopups;
            fly.alert = createAlert;
            fly.confirm = createConfirm;
            fly.prompt = createPrompt;
            fly.toast = createToast;
            fly.showLoading = creatingLoading;
            fly.hideLoading = closePopup;

        },{
            './Core': 3
        }
    ], 
    7: [ // ActionSheet
        
        function(require, module, exports) {

            var fly = require('./Core');
            var Utils = require('./Utils'),
                trigger = Utils.trigger;
            var preventDefault = function(e) {
                e.preventDefault();
            }

            var popover;

            var CLASS_POPOVER = 'ui-popover';
            var CLASS_ACTION_POPOVER = 'ui-popover-action';
            var CLASS_BACKDROP = 'ui-popup-backdrop';
            var CLASS_ACTION_BACKDROP = 'ui-backdrop-action';
            var CLASS_ACTIVE = 'ui-active';
            var CLASS_BOTTOM = 'ui-bottom';

            
            var onPopoverShown = function(e) {
                this.removeEventListener('webkitTransitionEnd', onPopoverShown);
                this.addEventListener('touchmove', preventDefault);
                trigger(this, 'shown', this);
            }
            var onPopoverHidden = function(e) {
                setStyle(this, 'none');
                this.removeEventListener('webkitTransitionEnd', onPopoverHidden);
                this.removeEventListener('touchmove', preventDefault);
                trigger(this, 'hidden', this);
            };

            var backdrop = (function() {
                var element = document.createElement('div');
                element.classList.add(CLASS_BACKDROP);
                element.addEventListener('touchmove', preventDefault);
                element.addEventListener('tap', function(e) {
                    if (popover) {
                        popover.addEventListener('webkitTransitionEnd', onPopoverHidden);
                        popover.classList.remove(CLASS_ACTIVE);
                        removeBackdrop(popover);
                        document.body.setAttribute('style', ''); 
                    }
                });

                return element;
            }());
            var removeBackdropTimer;
            var removeBackdrop = function(_popover) {
                backdrop.setAttribute('style', 'opacity:0');
                popover = null; //reset
                removeBackdropTimer = Utils.later(function() {
                    if (!_popover.classList.contains(CLASS_ACTIVE) && backdrop.parentNode && backdrop.parentNode === document.body) {
                        document.body.removeChild(backdrop);
                    }
                }, 350);
            };
          
            var togglePopover = function(popover, state) {
                if ((state === 'show' && popover.classList.contains(CLASS_ACTIVE)) || (state === 'hide' && !popover.classList.contains(CLASS_ACTIVE))) {
                    return;
                }
                removeBackdropTimer && removeBackdropTimer.cancel(); //取消remove的timer
                //remove一遍，以免来回快速切换，导致webkitTransitionEnd不触发，无法remove
                popover.removeEventListener('webkitTransitionEnd', onPopoverShown);
                popover.removeEventListener('webkitTransitionEnd', onPopoverHidden);
                backdrop.classList.remove(CLASS_ACTION_BACKDROP);
                var _popover = document.querySelector('.ui-popover.ui-active');
                if (_popover) {
                    _popover.addEventListener('webkitTransitionEnd', onPopoverHidden);
                    _popover.classList.remove(CLASS_ACTIVE);
                    if (popover === _popover) {
                        removeBackdrop(_popover);
                        return;
                    }
                }
                var isActionSheet = false;
                if (popover.classList.contains(CLASS_ACTION_POPOVER)) { 
                    isActionSheet = true;
                    backdrop.classList.add(CLASS_ACTION_BACKDROP);
                }
                setStyle(popover, 'block'); //actionsheet transform
                popover.offsetHeight;
                popover.classList.add(CLASS_ACTIVE);
                backdrop.setAttribute('style', '');
                document.body.appendChild(backdrop);
                calPosition(popover, isActionSheet); //position
                backdrop.classList.add(CLASS_ACTIVE);
                popover.addEventListener('webkitTransitionEnd', onPopoverShown);
            };
            var setStyle = function(popover, display, top, left) {
                var style = popover.style;
                if (typeof display !== 'undefined')
                    style.display = display;
                if (typeof top !== 'undefined')
                    style.top = top + 'px';
                if (typeof left !== 'undefined')
                    style.left = left + 'px';
            };
            var calPosition = function(popover, isActionSheet) {
                if (!popover) {
                    return;
                }

                if (isActionSheet) { //actionsheet
                    setStyle(popover, 'block')
                    return;
                }

                var wWidth = window.innerWidth;
                var wHeight = window.innerHeight;

                var pWidth = popover.offsetWidth;
                var pHeight = popover.offsetHeight;

                var pTop = (wHeight - pHeight ) / 2;
                var pLeft = (wWidth - pWidth ) / 2;

                setStyle(popover, 'block', pTop, pLeft);
            };

            fly.createMask = function(callback) {
                var element = document.createElement('div');
                element.classList.add(CLASS_BACKDROP);
                element.addEventListener('touchmove', preventDefault);
                element.addEventListener('tap', function() {
                    mask.close();
                });
                var mask = [element];
                mask._show = false;
                mask.show = function() {
                    mask._show = true;
                    element.setAttribute('style', 'opacity:1');
                    document.body.appendChild(element);
                    return mask;
                };
                mask._remove = function() {
                    if (mask._show) {
                        mask._show = false;
                        element.setAttribute('style', 'opacity:0');
                        Utils.later(function() {
                            var body = document.body;
                            element.parentNode === body && body.removeChild(element);
                        }, 350);
                    }
                    return mask;
                };
                mask.close = function() {
                    if (callback) {
                        if (callback() !== false) {
                            mask._remove();
                        }
                    } else {
                        mask._remove();
                    }
                };
                return mask;
            };
            $.fn.popover = function() {
                var args = arguments;
                this.each(function() {
                    popover = this;
                    if (args[0] === 'show' || args[0] === 'hide' || args[0] === 'toggle') {
                        togglePopover(this, args[0]);
                    }
                });
            };


        },{
            './Core': 3, 
            './Utils': 5
        }
    ],
    8: [ // PullToRefresh
        
        function(require, module, exports) {

            var fly = require('./Core');
            var Class = require('./Class');
            var Scroll = require('./Scroll');

            var CLASS_PULL_TOP_POCKET = 'ui-pull-top-pocket';
            var CLASS_PULL_BOTTOM_POCKET = 'ui-pull-bottom-pocket';
            var CLASS_PULL = 'ui-pull';
            var CLASS_PULL_LOADING = 'ui-pull-loading';
            var CLASS_PULL_CAPTION = 'ui-pull-caption';
            var CLASS_PULL_CAPTION_DOWN = 'ui-pull-caption-down';
            var CLASS_PULL_CAPTION_REFRESH = 'ui-pull-caption-refresh';
            var CLASS_PULL_CAPTION_NOMORE = 'ui-pull-caption-nomore';

            var CLASS_ICON = 'ui-icon';
            var CLASS_SPINNER = 'icon-refresh-loading';
            var CLASS_ICON_PULLDOWN = 'icon-refresh';

            var CLASS_BLOCK = 'ui-block';
            var CLASS_HIDDEN = 'ui-hidden';
            var CLASS_VISIBILITY = 'ui-visibility';

            var CLASS_LOADING_UP = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_ICON_PULLDOWN;
            var CLASS_LOADING_DOWN = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_ICON_PULLDOWN;
            var CLASS_LOADING = CLASS_PULL_LOADING + ' ' + CLASS_ICON + ' ' + CLASS_SPINNER;

            var pocketHtml = ['<div class="' + CLASS_PULL + '">', '<div class="{icon}"></div>', '<div class="' + CLASS_PULL_CAPTION + '">{contentrefresh}</div>', '</div>'].join('');

            var _PullRefresh = {

                init: function(element, options) {
                    this._super(element, $.extend(true, {
                        scrollY: true,
                        scrollX: false,
                        indicators: true,
                        deceleration: 0.003,
                        down: {
                            height: 50,
                            contentinit: '下拉可以刷新',
                            contentdown: '下拉可以刷新',
                            contentover: '释放立即刷新',
                            contentrefresh: '正在刷新...'
                        },
                        up: {
                            height: 50,
                            auto: false,
                            contentinit: '上拉显示更多',
                            contentdown: '上拉显示更多',
                            contentrefresh: '正在加载...',
                            contentnomore: '没有更多数据了',
                            duration: 300
                        }
                    }, options));
                },
                _init: function() {
                    this._super();
                    this._initPocket();
                },
                _initPulldownRefresh: function() {
                    this.pulldown = true;
                    this.pullPocket = this.topPocket;
                    this.pullPocket.classList.add(CLASS_BLOCK);
                    this.pullPocket.classList.add(CLASS_VISIBILITY);
                    this.pullCaption = this.topCaption;
                    this.pullLoading = this.topLoading;
                },
                _initPullupRefresh: function() {
                    this.pulldown = false;
                    this.pullPocket = this.bottomPocket;
                    this.pullPocket.classList.add(CLASS_BLOCK);
                    this.pullPocket.classList.add(CLASS_VISIBILITY);
                    this.pullCaption = this.bottomCaption;
                    this.pullLoading = this.bottomLoading;
                },
                _initPocket: function() {
                    var options = this.options;
                    if (options.down && options.down.hasOwnProperty('callback')) {
                        this.topPocket = this.scroller.querySelector('.' + CLASS_PULL_TOP_POCKET);
                        if (!this.topPocket) {
                            this.topPocket = this._createPocket(CLASS_PULL_TOP_POCKET, options.down, CLASS_LOADING_DOWN);
                            this.wrapper.insertBefore(this.topPocket, this.wrapper.firstChild);
                        }
                        this.topLoading = this.topPocket.querySelector('.' + CLASS_PULL_LOADING);
                        this.topCaption = this.topPocket.querySelector('.' + CLASS_PULL_CAPTION);
                    }
                    if (options.up && options.up.hasOwnProperty('callback')) {
                        this.bottomPocket = this.scroller.querySelector('.' + CLASS_PULL_BOTTOM_POCKET);
                        if (!this.bottomPocket) {
                            this.bottomPocket = this._createPocket(CLASS_PULL_BOTTOM_POCKET, options.up, CLASS_LOADING);
                            this.scroller.appendChild(this.bottomPocket);
                        }
                        this.bottomLoading = this.bottomPocket.querySelector('.' + CLASS_PULL_LOADING);
                        this.bottomCaption = this.bottomPocket.querySelector('.' + CLASS_PULL_CAPTION);
                        //TODO only for h5
                        this.wrapper.addEventListener('scrollbottom', this);
                    }
                },
                _createPocket: function(clazz, options, iconClass) {
                    var pocket = document.createElement('div');
                    pocket.className = clazz;
                    pocket.innerHTML = pocketHtml.replace('{contentrefresh}', options.contentinit).replace('{icon}', iconClass);
                    return pocket;
                },
                _resetPullDownLoading: function() {
                    var loading = this.pullLoading;
                    if (loading) {
                        this.pullCaption.innerHTML = this.options.down.contentdown;
                        loading.style.webkitTransition = "";
                        loading.style.webkitTransform = "";
                        loading.style.webkitAnimation = "";
                        loading.className = CLASS_LOADING_DOWN;
                    }
                },
                _setCaptionClass: function(isPulldown, caption, title) {
                    if (!isPulldown) {
                        switch (title) {
                            case this.options.up.contentdown:
                                caption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_DOWN;
                                break;
                            case this.options.up.contentrefresh:
                                caption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_REFRESH
                                break;
                            case this.options.up.contentnomore:
                                caption.className = CLASS_PULL_CAPTION + ' ' + CLASS_PULL_CAPTION_NOMORE;
                                break;
                        }
                    }
                },
                _setCaption: function(title, reset) {
                    if (this.loading) {
                        return;
                    }
                    var options = this.options;
                    var pocket = this.pullPocket;
                    var caption = this.pullCaption;
                    var loading = this.pullLoading;
                    var isPulldown = this.pulldown;
                    var self = this;
                    if (pocket) {
                        if (reset) {
                            setTimeout(function() {
                                caption.innerHTML = self.lastTitle = title;
                                if (isPulldown) {
                                    loading.className = CLASS_LOADING_DOWN;
                                } else {
                                    self._setCaptionClass(false, caption, title);
                                    loading.className = CLASS_LOADING;
                                }
                                loading.style.webkitAnimation = "";
                                loading.style.webkitTransition = "";
                                loading.style.webkitTransform = "";
                            }, 100);
                        } else {
                            if (title !== this.lastTitle) {
                                caption.innerHTML = title;
                                if (isPulldown) {
                                    if (title === options.down.contentrefresh) {
                                        loading.className = CLASS_LOADING;
                                        loading.style.webkitTransform = "";
                                    } else if (title === options.down.contentover) {
                                        loading.className = CLASS_LOADING_UP;
                                        loading.style.webkitTransition = "-webkit-transform 0.3s ease-in";
                                        loading.style.webkitTransform = "rotate(180deg)";
                                    } else if (title === options.down.contentdown) {
                                        loading.className = CLASS_LOADING_DOWN;
                                        loading.style.webkitTransition = "-webkit-transform 0.3s ease-in";
                                        loading.style.webkitTransform = "rotate(0deg)";
                                    }
                                } else {
                                    if (title === options.up.contentrefresh) {
                                        loading.className = CLASS_LOADING + ' ' + CLASS_VISIBILITY;
                                        loading.style.webkitTransform = "";
                                    } else {
                                        loading.className = CLASS_LOADING + ' ' + CLASS_HIDDEN;
                                    }
                                    self._setCaptionClass(false, caption, title);
                                }
                                this.lastTitle = title;
                            }
                        }

                    }
                }
            };

            var PullRefresh = Scroll.extend($.extend({
                handleEvent: function(e) {
                    this._super(e);
                    if (e.type === 'scrollbottom') {
                        if (e.target === this.scroller) {
                            this._scrollbottom();
                        }
                    }
                },
                _scrollbottom: function() {
                    if (!this.pulldown && !this.loading) {
                        this.pulldown = false;
                        this._initPullupRefresh();
                        this.pullupLoading();
                    }
                },
                _start: function(e) {
                    //仅下拉刷新在start阻止默认事件
                    if (e.touches && e.touches.length && e.touches[0].clientX > 30) {
                        e.target && !this._preventDefaultException(e.target, this.options.preventDefaultException) && e.preventDefault();
                    }
                    if (!this.loading) {
                        this.pulldown = this.pullPocket = this.pullCaption = this.pullLoading = false
                    }
                    this._super(e);
                },
                _drag: function(e) {
                    this._super(e);
                    if (!this.pulldown && !this.loading && this.topPocket && e.detail.direction === 'down' && this.y >= 0) {
                        this._initPulldownRefresh();
                    }
                    if (this.pulldown) {
                        this._setCaption(this.y > this.options.down.height ? this.options.down.contentover : this.options.down.contentdown);
                    }
                },

                _reLayout: function() {
                    this.hasVerticalScroll = true;
                    this._super();
                },
                //API
                resetPosition: function(time) {
                    if (this.pulldown) {
                        if (this.y >= this.options.down.height) {
                            this.pulldownLoading(undefined, time || 0);
                            return true;
                        } else {
                            !this.loading && this.topPocket.classList.remove(CLASS_VISIBILITY);
                        }
                    }
                    return this._super(time);
                },
                pulldownLoading: function(y, time) {
                    typeof y === 'undefined' && (y = this.options.down.height); //默认高度
                    this.scrollTo(0, y, time, this.options.bounceEasing);
                    if (this.loading) {
                        return;
                    }
                    //          if (!this.pulldown) {
                    this._initPulldownRefresh();
                    //          }
                    this._setCaption(this.options.down.contentrefresh);
                    this.loading = true;
                    this.indicators.map(function(indicator) {
                        indicator.fade(0);
                    });
                    var callback = this.options.down.callback;
                    callback && callback.call(this);
                },
                endPulldownToRefresh: function() {
                    var self = this;
                    if (self.topPocket && self.loading && this.pulldown) {
                        self.scrollTo(0, 0, self.options.bounceTime, self.options.bounceEasing);
                        self.loading = false;
                        self._setCaption(self.options.down.contentdown, true);
                        setTimeout(function() {
                            self.loading || self.topPocket.classList.remove(CLASS_VISIBILITY);
                        }, 350);
                    }
                },
                pullupLoading: function(callback, x, time) {
                    x = x || 0;
                    this.scrollTo(x, this.maxScrollY, time, this.options.bounceEasing);
                    if (this.loading) {
                        return;
                    }
                    this._initPullupRefresh();
                    this._setCaption(this.options.up.contentrefresh);
                    this.indicators.map(function(indicator) {
                        indicator.fade(0);
                    });
                    this.loading = true;
                    callback = callback || this.options.up.callback;
                    callback && callback.call(this);
                },
                endPullupToRefresh: function(finished) {
                    var self = this;
                    if (self.bottomPocket) { // && self.loading && !this.pulldown
                        self.loading = false;
                        if (finished) {
                            this.finished = true;
                            self._setCaption(self.options.up.contentnomore);
                            self.wrapper.removeEventListener('scrollbottom', self);
                        } else {
                            self._setCaption(self.options.up.contentdown);
                            self.loading || self.bottomPocket.classList.remove(CLASS_VISIBILITY);
                        }
                    }
                },
                disablePullupToRefresh: function() {
                    this._initPullupRefresh();
                    this.bottomPocket.className = 'ui-pull-bottom-pocket' + ' ' + CLASS_HIDDEN;
                    this.wrapper.removeEventListener('scrollbottom', this);
                },
                enablePullupToRefresh: function() {
                    this._initPullupRefresh();
                    this.bottomPocket.classList.remove(CLASS_HIDDEN);
                    this._setCaption(this.options.up.contentdown);
                    this.wrapper.addEventListener('scrollbottom', this);
                },
                refresh: function(isReset) {
                    if (isReset && this.finished) {
                        this.enablePullupToRefresh();
                        this.finished = false;
                    }
                    this._super();
                },
            }, _PullRefresh));

            $.fn.pullRefresh = function(options) {
                if (this.length === 1) {
                    var self = this[0];
                    var pullRefreshApi = null;
                    options = options || {};
                    var id = self.getAttribute('data-pullrefresh');
                    if (!id) {
                        id = ++fly.uuid;
                        fly.CacheData[id] = pullRefreshApi = new PullRefresh(self, options);
                        self.setAttribute('data-pullrefresh', id);
                    } else {
                        pullRefreshApi = fly.CacheData[id];
                    }
                    if (options.down && options.down.auto) { //如果设置了auto，则自动下拉一次
                        pullRefreshApi.pulldownLoading(options.down.autoY);
                    } else if (options.up && options.up.auto) { //如果设置了auto，则自动上拉一次
                        pullRefreshApi.pullupLoading();
                    }
                    return pullRefreshApi;
                }
            };

        },{
            './Core': 3,
            './Class': 10,
            './Scroll': 11
        }
    ],
    9: [
        function(require, module, exports) {
            require('./FastClick');
            require('./Router');
            require('./Core');
            require('./Slider');
            require('./Utils');
            require('./Modals');
            require('./Popover');
            require('./PullRefresh');
            require('./Scroll');


        }, {
            './FastClick': 1,
            './Router': 2,
            './Core': 3,
            './Slider': 4,
            './Utils': 5,
            './Modals': 6,
            './Popover': 7,
            './PullRefresh': 8,
            './Scroll': 11
        }
    ], 
    10: [ // Class
        
        function(require, module, exports) {
            var initializing = false,
                fnTest = /xyz/.test(function() {
                    xyz;
                }) ? /\b_super\b/ : /.*/;

            var Class = function() {};
            Class.extend = function(prop) {
                var _super = this.prototype;
                initializing = true;
                var prototype = new this();
                initializing = false;
                for (var name in prop) {
                    prototype[name] = typeof prop[name] == "function" &&
                        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                        (function(name, fn) {
                            return function() {
                                var tmp = this._super;

                                this._super = _super[name];

                                var ret = fn.apply(this, arguments);
                                this._super = tmp;

                                return ret;
                            };
                        })(name, prop[name]) :
                        prop[name];
                }
                function Class() {
                    if (!initializing && this.init)
                        this.init.apply(this, arguments);
                }
                Class.prototype = prototype;
                Class.prototype.constructor = Class;
                Class.extend = arguments.callee;
                return Class;
            };
            module.exports = Class;
        }, {}
    ], 
    11: [ // Scroll
        
        function(require, module, exports) {

            var fly = require('./Core');
            var Class = require('./Class');
            var OS = require('./OS');
            var Utils = require('./Utils');

            require('./Gestures');
            require('./Gestures.Drag');
            require('./Gestures.Flick');
            require('./Gestures.Tap');

            var CLASS_SCROLL = 'ui-scroll';
            var CLASS_SCROLLBAR = 'ui-scrollbar';
            var CLASS_INDICATOR = 'ui-scrollbar-indicator';
            var CLASS_SCROLLBAR_VERTICAL = CLASS_SCROLLBAR + '-vertical';
            var CLASS_SCROLLBAR_HORIZONTAL = CLASS_SCROLLBAR + '-horizontal';

            var CLASS_ACTIVE = 'ui-active';
           
            var ease = {
                quadratic: {
                    style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    fn: function(k) {
                        return k * (2 - k);
                    }
                },
                circular: {
                    style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
                    fn: function(k) {
                        return Math.sqrt(1 - (--k * k));
                    }
                },
                outCirc: {
                    style: 'cubic-bezier(0.075, 0.82, 0.165, 1)'
                },
                outCubic: {
                    style: 'cubic-bezier(0.165, 0.84, 0.44, 1)'
                }
            };

            var trigger = Utils.trigger;
            var getStyles = Utils.getStyles;
            var gestures = fly.gestures;
            gestures.session = {};

            var Scroll = Class.extend({

                init: function(element, options) {
                    this.wrapper = this.element = element;
                    this.scroller = this.wrapper.children[0];
                    this.scrollerStyle = this.scroller && this.scroller.style;
                    this.stopped = false;

                    this.options = $.extend(true, {
                        scrollY: true, //是否竖向滚动
                        scrollX: false, //是否横向滚动
                        startX: 0, //初始化时滚动至x
                        startY: 0, //初始化时滚动至y

                        indicators: true, //是否显示滚动条
                        stopPropagation: false,
                        hardwareAccelerated: true,
                        fixedBadAndorid: false,
                        preventDefaultException: {
                            tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|VIDEO|A)$/
                        },
                        momentum: true,

                        snapX: 0.5, //横向切换距离(以当前容器宽度为基准)
                        snap: false, //图片轮播，拖拽式选项卡

                        bounce: true, //是否启用回弹
                        bounceTime: 500, //回弹动画时间
                        bounceEasing: ease.outCirc, //回弹动画曲线

                        scrollTime: 500,
                        scrollEasing: ease.outCubic, //轮播动画曲线

                        directionLockThreshold: 5,

                        parallaxElement: false, //视差元素
                        parallaxRatio: 0.5
                    }, options);

                    this.x = 0;
                    this.y = 0;
                    this.translateZ = this.options.hardwareAccelerated ? ' translateZ(0)' : '';

                    this._init();
                    if (this.scroller) {
                        this.refresh();
                        //this.scrollTo(this.options.startX, this.options.startY);
                    }
                },
                _init: function() {
                    this._initParallax();
                    this._initIndicators();
                    this._initEvent();
                },
                _initParallax: function() {
                    if (this.options.parallaxElement) {
                        this.parallaxElement = document.querySelector(this.options.parallaxElement);
                        this.parallaxStyle = this.parallaxElement.style;
                        this.parallaxHeight = this.parallaxElement.offsetHeight;
                        this.parallaxImgStyle = this.parallaxElement.querySelector('img').style;
                    }
                },
                _initIndicators: function() {
                    var self = this;
                    self.indicators = [];
                    if (!this.options.indicators) {
                        return;
                    }
                    var indicators = [],
                        indicator;

                    // Vertical scrollbar
                    if (self.options.scrollY) {
                        indicator = {
                            el: this._createScrollBar(CLASS_SCROLLBAR_VERTICAL),
                            listenX: false
                        };

                        this.wrapper.appendChild(indicator.el);
                        indicators.push(indicator);
                    }

                    // Horizontal scrollbar
                    if (this.options.scrollX) {
                        indicator = {
                            el: this._createScrollBar(CLASS_SCROLLBAR_HORIZONTAL),
                            listenY: false
                        };

                        this.wrapper.appendChild(indicator.el);
                        indicators.push(indicator);
                    }

                    for (var i = indicators.length; i--;) {
                        this.indicators.push(new Indicator(this, indicators[i]));
                    }

                },
                _initSnap: function() {
                    this.currentPage = {};
                    this.pages = [];
                    var snaps = this.snaps;
                    var length = snaps.length;
                    var m = 0;
                    var n = -1;
                    var x = 0;
                    var leftX = 0;
                    var rightX = 0;
                    var snapX = 0;
                    for (var i = 0; i < length; i++) {
                        var snap = snaps[i];
                        var offsetLeft = snap.offsetLeft;
                        var offsetWidth = snap.offsetWidth;
                        if (i === 0 || offsetLeft <= snaps[i - 1].offsetLeft) {
                            m = 0;
                            n++;
                        }
                        if (!this.pages[m]) {
                            this.pages[m] = [];
                        }
                        x = this._getSnapX(offsetLeft);
                        snapX = Math.round((offsetWidth) * this.options.snapX);
                        leftX = x - snapX;
                        rightX = x - offsetWidth + snapX;
                        this.pages[m][n] = {
                            x: x,
                            leftX: leftX,
                            rightX: rightX,
                            pageX: m,
                            element: snap
                        }
                        if (snap.classList.contains(CLASS_ACTIVE)) {
                            this.currentPage = this.pages[m][0];
                        }
                        if (x >= this.maxScrollX) {
                            m++;
                        }
                    }
                    this.options.startX = this.currentPage.x || 0;
                },
                _getSnapX: function(offsetLeft) {
                    return Math.max(Math.min(0, -offsetLeft + (this.wrapperWidth / 2)), this.maxScrollX);
                },
                _gotoPage: function(index) {
                    this.currentPage = this.pages[Math.min(index, this.pages.length - 1)][0];
                    for (var i = 0, len = this.snaps.length; i < len; i++) {
                        if (i === index) {
                            this.snaps[i].classList.add(CLASS_ACTIVE);
                        } else {
                            this.snaps[i].classList.remove(CLASS_ACTIVE);
                        }
                    }
                    this.scrollTo(this.currentPage.x, 0, this.options.scrollTime);
                },
                _nearestSnap: function(x) {
                    if (!this.pages.length) {
                        return {
                            x: 0,
                            pageX: 0
                        };
                    }
                    var i = 0;
                    var length = this.pages.length;
                    if (x > 0) {
                        x = 0;
                    } else if (x < this.maxScrollX) {
                        x = this.maxScrollX;
                    }
                    for (; i < length; i++) {
                        var nearestX = this.direction === 'left' ? this.pages[i][0].leftX : this.pages[i][0].rightX;
                        if (x >= nearestX) {
                            return this.pages[i][0];
                        }
                    }
                    return {
                        x: 0,
                        pageX: 0
                    };
                },
                _initEvent: function(detach) {
                    var action = detach ? 'removeEventListener' : 'addEventListener';
                    window[action]('orientationchange', this);
                    window[action]('resize', this);

                    this.scroller[action]('webkitTransitionEnd', this);

                    this.wrapper[action]('touchstart', this);
                    this.wrapper[action]('touchcancel', this);
                    this.wrapper[action]('touchend', this);
                    this.wrapper[action]('drag', this);
                    this.wrapper[action]('dragend', this);
                    this.wrapper[action]('flick', this);
                    this.wrapper[action]('scrollend', this);
                    if (this.options.scrollX) {
                        this.wrapper[action]('swiperight', this);
                    }
                    var segmentedControl = this.wrapper.querySelector('.ui-segmented-control');
                    if (segmentedControl) { 
                        $(segmentedControl)[detach ? 'off' : 'on']('click', 'a', function(e) {e.preventDefault();});
                    }

                    this.wrapper[action]('scrollstart', this);
                    this.wrapper[action]('refresh', this);
                },
                _handleIndicatorScrollend: function() {
                    this.indicators.map(function(indicator) {
                        indicator.fade();
                    });
                },
                _handleIndicatorScrollstart: function() {
                    this.indicators.map(function(indicator) {
                        indicator.fade(1);
                    });
                },
                _handleIndicatorRefresh: function() {
                    this.indicators.map(function(indicator) {
                        indicator.refresh();
                    });
                },
                handleEvent: function(e) {
                    if (this.stopped) {
                        this.resetPosition();
                        return;
                    }

                    switch (e.type) {
                        case 'touchstart':
                            this._start(e);
                            break;
                        case 'drag':
                            this.options.stopPropagation && e.stopPropagation();
                            this._drag(e);
                            break;
                        case 'dragend':
                        case 'flick':
                            this.options.stopPropagation && e.stopPropagation();
                            this._flick(e);
                            break;
                        case 'touchcancel':
                        case 'touchend':
                            this._end(e);
                            break;
                        case 'webkitTransitionEnd':
                            this.transitionTimer && this.transitionTimer.cancel();
                            this._transitionEnd(e);
                            break;
                        case 'scrollstart':
                            this._handleIndicatorScrollstart(e);
                            break;
                        case 'scrollend':
                            this._handleIndicatorScrollend(e);
                            this._scrollend(e);
                            e.stopPropagation();
                            break;
                        case 'orientationchange':
                        case 'resize':
                            this._resize();
                            break;
                        case 'swiperight':
                            e.stopPropagation();
                            break;
                        case 'refresh':
                            this._handleIndicatorRefresh(e);
                            break;

                    }
                },
                _start: function(e) {
                    this.moved = this.needReset = false;
                    this._transitionTime();
                    if (this.isInTransition) {
                        this.needReset = true;
                        this.isInTransition = false;
                        var pos = fly.utils.parseTranslateMatrix(getStyles(this.scroller, 'webkitTransform'));
                        this.setTranslate(Math.round(pos.x), Math.round(pos.y));
                        trigger(this.scroller, 'scrollend', this);
                        e.preventDefault();
                    }
                    this.reLayout();
                },
                _getDirectionByAngle: function(angle) {
                    if (angle < -80 && angle > -100) {
                        return 'up';
                    } else if (angle >= 80 && angle < 100) {
                        return 'down';
                    } else if (angle >= 170 || angle <= -170) {
                        return 'left';
                    } else if (angle >= -35 && angle <= 10) {
                        return 'right';
                    }
                    return null;
                },
                _drag: function(e) {
                    var detail = e.detail;
                    if (this.options.scrollY || detail.direction === 'up' || detail.direction === 'down') { 
                        //ios8 hack
                        if (OS.ios && parseFloat(OS.version) >= 8) { //多webview时，离开当前webview会导致后续touch事件不触发
                            var clientY = detail.gesture.touches[0].clientY;
                            //下拉刷新 or 上拉加载
                            if ((clientY + 10) > window.innerHeight || clientY < 10) {
                                this.resetPosition(this.options.bounceTime);
                                return;
                            }
                        }
                    }
                    var isPreventDefault = isReturn = false;
                    var direction = this._getDirectionByAngle(detail.angle);
                    if (detail.direction === 'left' || detail.direction === 'right') {
                        if (this.options.scrollX) {
                            isPreventDefault = true;
                            if (!this.moved) {
                                gestures.session.lockDirection = true; //锁定方向
                                gestures.session.startDirection = detail.direction;
                            }
                        } else if (this.options.scrollY && !this.moved) {
                            isReturn = true;
                        }
                    } else if (detail.direction === 'up' || detail.direction === 'down') {
                        if (this.options.scrollY) {
                            isPreventDefault = true;
                            if (!this.moved) {
                                gestures.session.lockDirection = true; //锁定方向
                                gestures.session.startDirection = detail.direction;
                            }
                        } else if (this.options.scrollX && !this.moved) {
                            isReturn = true;
                        }
                    } else {
                        isReturn = true;
                    }
                    if (this.moved || isPreventDefault) {
                        e.stopPropagation(); //阻止冒泡(scroll类嵌套)
                        detail.gesture && detail.gesture.preventDefault();
                    }
                    if (isReturn) { //禁止非法方向滚动
                        return;
                    }
                    if (!this.moved) {
                        trigger(this.scroller, 'scrollstart', this);
                    } else {
                        e.stopPropagation(); //move期间阻止冒泡(scroll嵌套)
                    }
                    var deltaX = 0;
                    var deltaY = 0;
                    if (!this.moved) { //start
                        deltaX = detail.deltaX;
                        deltaY = detail.deltaY;
                    } else { //move
                        deltaX = detail.deltaX - gestures.session.prevTouch.deltaX;
                        deltaY = detail.deltaY - gestures.session.prevTouch.deltaY;
                    }
                    var absDeltaX = Math.abs(detail.deltaX);
                    var absDeltaY = Math.abs(detail.deltaY);
                    if (absDeltaX > absDeltaY + this.options.directionLockThreshold) {
                        deltaY = 0;
                    } else if (absDeltaY >= absDeltaX + this.options.directionLockThreshold) {
                        deltaX = 0;
                    }

                    deltaX = this.hasHorizontalScroll ? deltaX : 0;
                    deltaY = this.hasVerticalScroll ? deltaY : 0;
                    var newX = this.x + deltaX;
                    var newY = this.y + deltaY;
                    // Slow down if outside of the boundaries
                    if (newX > 0 || newX < this.maxScrollX) {
                        newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
                    }
                    if (newY > 0 || newY < this.maxScrollY) {
                        newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
                    }

                    if (!this.requestAnimationFrame) {
                        this._updateTranslate();
                    }
                    this.direction = detail.deltaX > 0 ? 'right' : 'left';
                    this.moved = true;
                    this.x = newX;
                    this.y = newY;
                    //trigger(this.scroller, 'scroll', this);
                },
                _flick: function(e) {
                    //          if (!this.moved || this.needReset) {
                    //              return;
                    //          }
                    if (!this.moved) {
                        return;
                    }
                    e.stopPropagation();
                    var detail = e.detail;
                    this._clearRequestAnimationFrame();
                    if (e.type === 'dragend' && detail.flick) { //dragend
                        return;
                    }

                    var newX = Math.round(this.x);
                    var newY = Math.round(this.y);

                    this.isInTransition = false;
                    // reset if we are outside of the boundaries
                    if (this.resetPosition(this.options.bounceTime)) {
                        return;
                    }

                    this.scrollTo(newX, newY); // ensures that the last position is rounded

                    if (e.type === 'dragend') { //dragend
                        trigger(this.scroller, 'scrollend', this);
                        return;
                    }
                    var time = 0;
                    var easing = '';
                    // start momentum animation if needed
                    if (this.options.momentum && detail.flickTime < 300) {
                        momentumX = this.hasHorizontalScroll ? this._momentum(this.x, detail.flickDistanceX, detail.flickTime, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : {
                            destination: newX,
                            duration: 0
                        };
                        momentumY = this.hasVerticalScroll ? this._momentum(this.y, detail.flickDistanceY, detail.flickTime, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : {
                            destination: newY,
                            duration: 0
                        };
                        newX = momentumX.destination;
                        newY = momentumY.destination;
                        time = Math.max(momentumX.duration, momentumY.duration);
                        this.isInTransition = true;
                    }

                    if (newX != this.x || newY != this.y) {
                        if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
                            easing = ease.quadratic;
                        }
                        this.scrollTo(newX, newY, time, easing);
                        return;
                    }

                    trigger(this.scroller, 'scrollend', this);
                    //          e.stopPropagation();
                },
                _end: function(e) {
                    this.needReset = false;
                    if ((!this.moved && this.needReset) || e.type === 'touchcancel') {
                        this.resetPosition();
                    }
                },
                _transitionEnd: function(e) {
                    if (e.target != this.scroller || !this.isInTransition) {
                        return;
                    }
                    this._transitionTime();
                    if (!this.resetPosition(this.options.bounceTime)) {
                        this.isInTransition = false;
                        trigger(this.scroller, 'scrollend', this);
                    }
                },
                _scrollend: function(e) {
                    if ((this.y === 0 && this.maxScrollY === 0) || (Math.abs(this.y) > 0 && this.y <= this.maxScrollY)) {
                        trigger(this.scroller, 'scrollbottom', this);
                    }
                },
                _resize: function() {
                    var that = this;
                    clearTimeout(that.resizeTimeout);
                    that.resizeTimeout = setTimeout(function() {
                        that.refresh();
                    }, that.options.resizePolling);
                },
                _transitionTime: function(time) {
                    time = time || 0;
                    this.scrollerStyle['webkitTransitionDuration'] = time + 'ms';
                    if (this.parallaxElement && this.options.scrollY) { //目前仅支持竖向视差效果
                        this.parallaxStyle['webkitTransitionDuration'] = time + 'ms';
                    }
                    if (this.options.fixedBadAndorid && !time && OS.isBadAndroid) {
                        this.scrollerStyle['webkitTransitionDuration'] = '0.001s';
                        if (this.parallaxElement && this.options.scrollY) { //目前仅支持竖向视差效果
                            this.parallaxStyle['webkitTransitionDuration'] = '0.001s';
                        }
                    }
                    if (this.indicators) {
                        for (var i = this.indicators.length; i--;) {
                            this.indicators[i].transitionTime(time);
                        }
                    }
                    if (time) { //自定义timer，保证webkitTransitionEnd始终触发
                        this.transitionTimer && this.transitionTimer.cancel();
                        this.transitionTimer = Utils.later(function() {
                            trigger(this.scroller, 'webkitTransitionEnd');
                        }, time + 100, this);
                    }
                },
                _transitionTimingFunction: function(easing) {
                    this.scrollerStyle['webkitTransitionTimingFunction'] = easing;
                    if (this.parallaxElement && this.options.scrollY) { //目前仅支持竖向视差效果
                        this.parallaxStyle['webkitTransitionDuration'] = easing;
                    }
                    if (this.indicators) {
                        for (var i = this.indicators.length; i--;) {
                            this.indicators[i].transitionTimingFunction(easing);
                        }
                    }
                },
                _translate: function(x, y) {
                    this.x = x;
                    this.y = y;
                },
                _clearRequestAnimationFrame: function() {
                    if (this.requestAnimationFrame) {
                        cancelAnimationFrame(this.requestAnimationFrame);
                        this.requestAnimationFrame = null;
                    }
                },
                _updateTranslate: function() {
                    var self = this;
                    if (self.x !== self.lastX || self.y !== self.lastY) {
                        self.setTranslate(self.x, self.y);
                    }
                    self.requestAnimationFrame = requestAnimationFrame(function() {
                        self._updateTranslate();
                    });
                },
                _createScrollBar: function(clazz) {
                    var scrollbar = document.createElement('div');
                    var indicator = document.createElement('div');
                    scrollbar.className = CLASS_SCROLLBAR + ' ' + clazz;
                    indicator.className = CLASS_INDICATOR;
                    scrollbar.appendChild(indicator);
                    if (clazz === CLASS_SCROLLBAR_VERTICAL) {
                        this.scrollbarY = scrollbar;
                        this.scrollbarIndicatorY = indicator;
                    } else if (clazz === CLASS_SCROLLBAR_HORIZONTAL) {
                        this.scrollbarX = scrollbar;
                        this.scrollbarIndicatorX = indicator;
                    }
                    this.wrapper.appendChild(scrollbar);
                    return scrollbar;
                },
                _preventDefaultException: function(el, exceptions) {
                    for (var i in exceptions) {
                        if (exceptions[i].test(el[i])) {
                            return true;
                        }
                    }
                    return false;
                },
                _reLayout: function() {
                    if (!this.hasHorizontalScroll) {
                        this.maxScrollX = 0;
                        this.scrollerWidth = this.wrapperWidth;
                    }

                    if (!this.hasVerticalScroll) {
                        this.maxScrollY = 0;
                        this.scrollerHeight = this.wrapperHeight;
                    }

                    this.indicators.map(function(indicator) {
                        indicator.refresh();
                    });

                    //以防slider类嵌套使用
                    if (this.options.snap && typeof this.options.snap === 'string') {
                        var items = this.scroller.querySelectorAll(this.options.snap);
                        this.itemLength = 0;
                        this.snaps = [];
                        for (var i = 0, len = items.length; i < len; i++) {
                            var item = items[i];
                            if (item.parentNode === this.scroller) {
                                this.itemLength++;
                                this.snaps.push(item);
                            }
                        }
                        this._initSnap(); //需要每次都_initSnap么。其实init的时候执行一次，后续resize的时候执行一次就行了吧.先这么做吧，如果影响性能，再调整
                    }
                },
                _momentum: function(current, distance, time, lowerMargin, wrapperSize, deceleration) {
                    var speed = parseFloat(Math.abs(distance) / time),
                        destination,
                        duration;

                    deceleration = deceleration === undefined ? 0.0006 : deceleration;
                    destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1);
                    duration = speed / deceleration;
                    if (destination < lowerMargin) {
                        destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
                        distance = Math.abs(destination - current);
                        duration = distance / speed;
                    } else if (destination > 0) {
                        destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
                        distance = Math.abs(current) + destination;
                        duration = distance / speed;
                    }

                    return {
                        destination: Math.round(destination),
                        duration: duration
                    };
                },
                _getTranslateStr: function(x, y) {
                    if (this.options.hardwareAccelerated) {
                        return 'translate3d(' + x + 'px,' + y + 'px,0px) ' + this.translateZ;
                    }
                    return 'translate(' + x + 'px,' + y + 'px) ';
                },
                //API
                setStopped: function(stopped) {
                    this.stopped = !!stopped;
                },
                setTranslate: function(x, y) {
                    this.x = x;
                    this.y = y;
                    this.scrollerStyle['webkitTransform'] = this._getTranslateStr(x, y);
                    if (this.parallaxElement && this.options.scrollY) { //目前仅支持竖向视差效果
                        var parallaxY = y * this.options.parallaxRatio;
                        var scale = 1 + parallaxY / ((this.parallaxHeight - parallaxY) / 2);
                        if (scale > 1) {
                            this.parallaxImgStyle['opacity'] = 1 - parallaxY / 100 * this.options.parallaxRatio;
                            this.parallaxStyle['webkitTransform'] = this._getTranslateStr(0, -parallaxY) + ' scale(' + scale + ',' + scale + ')';
                        } else {
                            this.parallaxImgStyle['opacity'] = 1;
                            this.parallaxStyle['webkitTransform'] = this._getTranslateStr(0, -1) + ' scale(1,1)';
                        }
                    }
                    if (this.indicators) {
                        for (var i = this.indicators.length; i--;) {
                            this.indicators[i].updatePosition();
                        }
                    }
                    this.lastX = this.x;
                    this.lastY = this.y;
                    trigger(this.scroller, 'scroll', this);
                },
                reLayout: function() {
                    this.wrapper.offsetHeight;
                    
                    var paddingLeft = parseFloat(getStyles(this.wrapper, 'padding-left')) || 0;
                    var paddingRight = parseFloat(getStyles(this.wrapper, 'padding-right')) || 0;
                    var paddingTop = parseFloat(getStyles(this.wrapper, 'padding-top')) || 0;
                    var paddingBottom = parseFloat(getStyles(this.wrapper, 'padding-bottom')) || 0;

                    var clientWidth = this.wrapper.clientWidth;
                    var clientHeight = this.wrapper.clientHeight;

                    this.scrollerWidth = this.scroller.offsetWidth;
                    this.scrollerHeight = this.scroller.offsetHeight;

                    this.wrapperWidth = clientWidth - paddingLeft - paddingRight;
                    this.wrapperHeight = clientHeight - paddingTop - paddingBottom;

                    this.maxScrollX = Math.min(this.wrapperWidth - this.scrollerWidth, 0);
                    this.maxScrollY = Math.min(this.wrapperHeight - this.scrollerHeight, 0);
                    this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
                    this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;
                    this._reLayout();
                },
                resetPosition: function(time) {
                    var x = this.x,
                        y = this.y;

                    time = time || 0;
                    if (!this.hasHorizontalScroll || this.x > 0) {
                        x = 0;
                    } else if (this.x < this.maxScrollX) {
                        x = this.maxScrollX;
                    }

                    if (!this.hasVerticalScroll || this.y > 0) {
                        y = 0;
                    } else if (this.y < this.maxScrollY) {
                        y = this.maxScrollY;
                    }

                    if (x == this.x && y == this.y) {
                        return false;
                    }
                    this.scrollTo(x, y, time, this.options.scrollEasing);

                    return true;
                },
                _reInit: function() {
                    var groups = this.wrapper.querySelectorAll('.' + CLASS_SCROLL);
                    for (var i = 0, len = groups.length; i < len; i++) {
                        if (groups[i].parentNode === this.wrapper) {
                            this.scroller = groups[i];
                            break;
                        }
                    }
                    this.scrollerStyle = this.scroller && this.scroller.style;
                },
                refresh: function() {
                    this._reInit();
                    this.reLayout();
                    trigger(this.scroller, 'refresh', this);
                    this.resetPosition();
                },
                scrollTo: function(x, y, time, easing) {
                    var easing = easing || ease.circular;
                    //          this.isInTransition = time > 0 && (this.lastX != x || this.lastY != y);
                    //暂不严格判断x,y，否则会导致部分版本上不正常触发轮播
                    this.isInTransition = time > 0;
                    if (this.isInTransition) {
                        this._clearRequestAnimationFrame();
                        this._transitionTimingFunction(easing.style);
                        this._transitionTime(time);
                        this.setTranslate(x, y);
                    } else {
                        this.setTranslate(x, y);
                    }

                },
                scrollToBottom: function(time, easing) {
                    time = time || this.options.scrollTime;
                    this.scrollTo(0, this.maxScrollY, time, easing);
                },
                gotoPage: function(index) {
                    this._gotoPage(index);
                },
                destroy: function() {
                    this._initEvent(true); //detach
                    delete fly.CacheData[this.wrapper.getAttribute('data-scroll')];
                    this.wrapper.setAttribute('data-scroll', '');
                }
            });

            //Indicator
            var Indicator = function(scroller, options) {
                this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
                this.wrapperStyle = this.wrapper.style;
                this.indicator = this.wrapper.children[0];
                this.indicatorStyle = this.indicator.style;
                this.scroller = scroller;

                this.options = $.extend({
                    listenX: true,
                    listenY: true,
                    fade: false,
                    speedRatioX: 0,
                    speedRatioY: 0
                }, options);

                this.sizeRatioX = 1;
                this.sizeRatioY = 1;
                this.maxPosX = 0;
                this.maxPosY = 0;

                if (this.options.fade) {
                    this.wrapperStyle['webkitTransform'] = this.scroller.translateZ;
                    this.wrapperStyle['webkitTransitionDuration'] = this.options.fixedBadAndorid && OS.isBadAndroid ? '0.001s' : '0ms';
                    this.wrapperStyle.opacity = '0';
                }
            }
            Indicator.prototype = {
                handleEvent: function(e) {

                },
                transitionTime: function(time) {
                    time = time || 0;
                    this.indicatorStyle['webkitTransitionDuration'] = time + 'ms';
                    if (this.scroller.options.fixedBadAndorid && !time && OS.isBadAndroid) {
                        this.indicatorStyle['webkitTransitionDuration'] = '0.001s';
                    }
                },
                transitionTimingFunction: function(easing) {
                    this.indicatorStyle['webkitTransitionTimingFunction'] = easing;
                },
                refresh: function() {
                    this.transitionTime();

                    if (this.options.listenX && !this.options.listenY) {
                        this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
                    } else if (this.options.listenY && !this.options.listenX) {
                        this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
                    } else {
                        this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
                    }

                    this.wrapper.offsetHeight; // force refresh

                    if (this.options.listenX) {
                        this.wrapperWidth = this.wrapper.clientWidth;
                        this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
                        this.indicatorStyle.width = this.indicatorWidth + 'px';

                        this.maxPosX = this.wrapperWidth - this.indicatorWidth;

                        this.minBoundaryX = 0;
                        this.maxBoundaryX = this.maxPosX;

                        this.sizeRatioX = this.options.speedRatioX || (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX));
                    }

                    if (this.options.listenY) {
                        this.wrapperHeight = this.wrapper.clientHeight;
                        this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
                        this.indicatorStyle.height = this.indicatorHeight + 'px';

                        this.maxPosY = this.wrapperHeight - this.indicatorHeight;

                        this.minBoundaryY = 0;
                        this.maxBoundaryY = this.maxPosY;

                        this.sizeRatioY = this.options.speedRatioY || (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY));
                    }

                    this.updatePosition();
                },

                updatePosition: function() {
                    var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
                        y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;

                    if (x < this.minBoundaryX) {
                        this.width = Math.max(this.indicatorWidth + x, 8);
                        this.indicatorStyle.width = this.width + 'px';
                        x = this.minBoundaryX;
                    } else if (x > this.maxBoundaryX) {
                        this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
                        this.indicatorStyle.width = this.width + 'px';
                        x = this.maxPosX + this.indicatorWidth - this.width;
                    } else if (this.width != this.indicatorWidth) {
                        this.width = this.indicatorWidth;
                        this.indicatorStyle.width = this.width + 'px';
                    }

                    if (y < this.minBoundaryY) {
                        this.height = Math.max(this.indicatorHeight + y * 3, 8);
                        this.indicatorStyle.height = this.height + 'px';
                        y = this.minBoundaryY;
                    } else if (y > this.maxBoundaryY) {
                        this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
                        this.indicatorStyle.height = this.height + 'px';
                        y = this.maxPosY + this.indicatorHeight - this.height;
                    } else if (this.height != this.indicatorHeight) {
                        this.height = this.indicatorHeight;
                        this.indicatorStyle.height = this.height + 'px';
                    }

                    this.x = x;
                    this.y = y;

                    this.indicatorStyle['webkitTransform'] = this.scroller._getTranslateStr(x, y);

                },
                fade: function(val, hold) {
                    if (hold && !this.visible) {
                        return;
                    }

                    clearTimeout(this.fadeTimeout);
                    this.fadeTimeout = null;

                    var time = val ? 250 : 500,
                        delay = val ? 0 : 300;

                    val = val ? '1' : '0';

                    this.wrapperStyle['webkitTransitionDuration'] = time + 'ms';

                    this.fadeTimeout = setTimeout((function(val) {
                        this.wrapperStyle.opacity = val;
                        this.visible = +val;
                    }).bind(this, val), delay);
                }
            };

            $.fn.scroll = function(options) {
                var scrollApis = [];
                this.each(function() {
                    var scrollApi = null;
                    var self = this;
                    var id = self.getAttribute('data-scroll');
                    if (!id) {
                        id = ++fly.uuid;
                        var _options = $.extend({}, options);
                        if (self.classList.contains('ui-segmented-control')) {
                            _options = $.extend(_options, {
                                scrollY: false,
                                scrollX: true,
                                indicators: false,
                                snap: '.ui-control-item'
                            });
                        }
                        fly.CacheData[id] = scrollApi = new Scroll(self, _options);
                        self.setAttribute('data-scroll', id);
                    } else {
                        scrollApi = fly.CacheData[id];
                    }
                    scrollApis.push(scrollApi);
                });
                return scrollApis.length === 1 ? scrollApis[0] : scrollApis;
            };

            module.exports = Scroll;

        }, {
            './Core': 3,
            './Utils' : 5,
            './Class': 10,
            './OS': 12,
            './Gestures': 13,
            './Gestures.Drag': 14,
            './Gestures.Flick': 15,
            './Gestures.Tap': 16
        }
    ],
    12: [ // OS detect
        function(require, module, exports) {
            var fly = require('./Core');
            function detect(ua) {
                this.os = {};
                var funcs = [

                    function() { //wechat
                        var wechat = ua.match(/(MicroMessenger)\/([\d\.]+)/i);
                        if (wechat) { //wechat
                            this.os.wechat = {
                                version: wechat[2].replace(/_/g, '.')
                            };
                        }
                        return false;
                    },
                    function() { //android
                        var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
                        if (android) {
                            this.os.android = true;
                            this.os.version = android[2];

                            this.os.isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion));
                        }
                        return this.os.android === true;
                    },
                    function() { //ios
                        var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);
                        if (iphone) { //iphone
                            this.os.ios = this.os.iphone = true;
                            this.os.version = iphone[2].replace(/_/g, '.');
                        } else {
                            var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
                            if (ipad) { //ipad
                                this.os.ios = this.os.ipad = true;
                                this.os.version = ipad[2].replace(/_/g, '.');
                            }
                        }
                        return this.os.ios === true;
                    }
                ];
                [].every.call(funcs, function(func) {
                    return !func.call(fly);
                });
            }
            detect.call(fly, navigator.userAgent);
            module.exports = fly.os;
        },{
            './Core' : 3
        }
    ],
    13: [ // Gestures 
        function(require, module, exports) {

            var fly = require('./Core');
            var OS = require('./OS');
            var Utils = require('./Utils');

            var trigger = Utils.trigger;

            fly.gestures = {
                addAction : function(type, hook) {
                    var hooks = fly.hooks[type];
                    if (!hooks) {
                        hooks = [];
                    }
                    hook.index = hook.index || 1000;
                    hooks.push(hook);
                    hooks.sort(function(a, b) {
                        return a.index - b.index;
                    });
                    fly.hooks[type] = hooks;
                    return fly.hooks[type];
                },
                doAction : function(type, callback) {
                    if (typeof callback == 'function') { //指定了callback
                        $.each(fly.hooks[type], callback);
                    } else { //未指定callback，直接执行
                        $.each(fly.hooks[type], function(index, hook) {
                            return !hook.handle();
                        });
                    }
                },
                addGesture : function(gesture) {
                    return this.addAction('gestures', gesture);
                }
            };

            var round = Math.round;
            var abs = Math.abs;
            var sqrt = Math.sqrt;
            var atan = Math.atan;
            var atan2 = Math.atan2;
            /**
             * distance
             * @param {type} p1
             * @param {type} p2
             * @returns {Number}
             */
            var getDistance = function(p1, p2, props) {
                if (!props) {
                    props = ['x', 'y'];
                }
                var x = p2[props[0]] - p1[props[0]];
                var y = p2[props[1]] - p1[props[1]];
                return sqrt((x * x) + (y * y));
            };
            /**
             * scale
             * @param {Object} starts
             * @param {Object} moves
             */
            var getScale = function(starts, moves) {
                if (starts.length >= 2 && moves.length >= 2) {
                    var props = ['pageX', 'pageY'];
                    return getDistance(moves[1], moves[0], props) / getDistance(starts[1], starts[0], props);
                }
                return 1;
            };
            /**
             * angle
             * @param {type} p1
             * @param {type} p2
             * @returns {Number}
             */
            var getAngle = function(p1, p2, props) {
                if (!props) {
                    props = ['x', 'y'];
                }
                var x = p2[props[0]] - p1[props[0]];
                var y = p2[props[1]] - p1[props[1]];
                return atan2(y, x) * 180 / Math.PI;
            };
            /**
             * direction
             * @param {Object} x
             * @param {Object} y
             */
            var getDirection = function(x, y) {
                if (x === y) {
                    return '';
                }
                if (abs(x) >= abs(y)) {
                    return x > 0 ? 'left' : 'right';
                }
                return y > 0 ? 'up' : 'down';
            };
            /**
             * rotation
             * @param {Object} start
             * @param {Object} end
             */
            var getRotation = function(start, end) {
                var props = ['pageX', 'pageY'];
                return getAngle(end[1], end[0], props) - getAngle(start[1], start[0], props);
            };
            /**
             * px per ms
             * @param {Object} deltaTime
             * @param {Object} x
             * @param {Object} y
             */
            var getVelocity = function(deltaTime, x, y) {
                return {
                    x: x / deltaTime || 0,
                    y: y / deltaTime || 0
                };
            };
            /**
             * detect gestures
             * @param {type} event
             * @param {type} touch
             * @returns {undefined}
             */
            var detect = function(event, touch) {
                if (fly.gestures.stoped) {
                    return;
                }
                fly.gestures.doAction('gestures', function(index, gesture) {
                    if (!fly.gestures.stoped) {
                        gesture.handle(event, touch);
                    }
                });
            };
            /**
             * 暂时无用
             * @param {Object} node
             * @param {Object} parent
             */
            var hasParent = function(node, parent) {
                while (node) {
                    if (node == parent) {
                        return true;
                    }
                    node = node.parentNode;
                }
                return false;
            };

            var uniqueArray = function(src, key, sort) {
                var results = [];
                var values = [];
                var i = 0;

                while (i < src.length) {
                    var val = key ? src[i][key] : src[i];
                    if (values.indexOf(val) < 0) {
                        results.push(src[i]);
                    }
                    values[i] = val;
                    i++;
                }

                if (sort) {
                    if (!key) {
                        results = results.sort();
                    } else {
                        results = results.sort(function sortUniqueArray(a, b) {
                            return a[key] > b[key];
                        });
                    }
                }

                return results;
            };
            var getMultiCenter = function(touches) {
                var touchesLength = touches.length;
                if (touchesLength === 1) {
                    return {
                        x: round(touches[0].pageX),
                        y: round(touches[0].pageY)
                    };
                }

                var x = 0;
                var y = 0;
                var i = 0;
                while (i < touchesLength) {
                    x += touches[i].pageX;
                    y += touches[i].pageY;
                    i++;
                }

                return {
                    x: round(x / touchesLength),
                    y: round(y / touchesLength)
                };
            };
            var multiTouch = function() {
                //return $.options.gestureConfig.pinch;
            };
            var copySimpleTouchData = function(touch) {
                var touches = [];
                var i = 0;
                while (i < touch.touches.length) {
                    touches[i] = {
                        pageX: round(touch.touches[i].pageX),
                        pageY: round(touch.touches[i].pageY)
                    };
                    i++;
                }
                return {
                    timestamp: +new Date(),
                    gesture: touch.gesture,
                    touches: touches,
                    center: getMultiCenter(touch.touches),
                    deltaX: touch.deltaX,
                    deltaY: touch.deltaY
                };
            };

            var calDelta = function(touch) {
                var session = fly.gestures.session;
                var center = touch.center;
                var offset = session.offsetDelta || {};
                var prevDelta = session.prevDelta || {};
                var prevTouch = session.prevTouch || {};

                if (touch.gesture.type === 'touchstart' || touch.gesture.type === 'touchend') {
                    prevDelta = session.prevDelta = {
                        x: prevTouch.deltaX || 0,
                        y: prevTouch.deltaY || 0
                    };

                    offset = session.offsetDelta = {
                        x: center.x,
                        y: center.y
                    };
                }
                touch.deltaX = prevDelta.x + (center.x - offset.x);
                touch.deltaY = prevDelta.y + (center.y - offset.y);
            };
            var calTouchData = function(touch) {
                var session = fly.gestures.session;
                var touches = touch.touches;
                var touchesLength = touches.length;

                if (!session.firstTouch) {
                    session.firstTouch = copySimpleTouchData(touch);
                }

                if (multiTouch() && touchesLength > 1 && !session.firstMultiTouch) {
                    session.firstMultiTouch = copySimpleTouchData(touch);
                } else if (touchesLength === 1) {
                    session.firstMultiTouch = false;
                }

                var firstTouch = session.firstTouch;
                var firstMultiTouch = session.firstMultiTouch;
                var offsetCenter = firstMultiTouch ? firstMultiTouch.center : firstTouch.center;

                var center = touch.center = getMultiCenter(touches);
                touch.timestamp = +new Date();
                touch.deltaTime = touch.timestamp - firstTouch.timestamp;

                touch.angle = getAngle(offsetCenter, center);
                touch.distance = getDistance(offsetCenter, center);

                calDelta(touch);

                touch.offsetDirection = getDirection(touch.deltaX, touch.deltaY);

                touch.scale = firstMultiTouch ? getScale(firstMultiTouch.touches, touches) : 1;
                touch.rotation = firstMultiTouch ? getRotation(firstMultiTouch.touches, touches) : 0;

                calIntervalTouchData(touch);

            };
            var CAL_INTERVAL = 25;
            var calIntervalTouchData = function(touch) {
                var session = fly.gestures.session;
                var last = session.lastInterval || touch;
                var deltaTime = touch.timestamp - last.timestamp;
                var velocity;
                var velocityX;
                var velocityY;
                var direction;

                if (touch.gesture.type != 'touchcancel' && (deltaTime > CAL_INTERVAL || last.velocity === undefined)) {
                    var deltaX = last.deltaX - touch.deltaX;
                    var deltaY = last.deltaY - touch.deltaY;

                    var v = getVelocity(deltaTime, deltaX, deltaY);
                    velocityX = v.x;
                    velocityY = v.y;
                    velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
                    direction = getDirection(deltaX, deltaY) || last.direction;

                    session.lastInterval = touch;
                } else {
                    velocity = last.velocity;
                    velocityX = last.velocityX;
                    velocityY = last.velocityY;
                    direction = last.direction;
                }

                touch.velocity = velocity;
                touch.velocityX = velocityX;
                touch.velocityY = velocityY;
                touch.direction = direction;
            };
            var targetIds = {};
            var convertTouches = function(touches) {
                for (var i = 0; i < touches.length; i++) {
                    !touches['identifier'] && (touches['identifier'] = 0);
                }
                return touches;
            };
            var getTouches = function(event, touch) {
                var allTouches = convertTouches([].slice.call(event.touches || [event]));

                var type = event.type;

                var targetTouches = [];
                var changedTargetTouches = [];

                //当touchstart或touchmove且touches长度为1，直接获得all和changed
                if ((type === 'touchstart' || type === 'touchmove') && allTouches.length === 1) {
                    targetIds[allTouches[0].identifier] = true;
                    targetTouches = allTouches;
                    changedTargetTouches = allTouches;
                    touch.target = event.target;
                } else {
                    var i = 0;
                    var targetTouches = [];
                    var changedTargetTouches = [];
                    var changedTouches = convertTouches([].slice.call(event.changedTouches || [event]));

                    touch.target = event.target;
                    var sessionTarget = fly.gestures.session.target || event.target;
                    targetTouches = allTouches.filter(function(touch) {
                        return hasParent(touch.target, sessionTarget);
                    });

                    if (type === 'touchstart') {
                        i = 0;
                        while (i < targetTouches.length) {
                            targetIds[targetTouches[i].identifier] = true;
                            i++;
                        }
                    }

                    i = 0;
                    while (i < changedTouches.length) {
                        if (targetIds[changedTouches[i].identifier]) {
                            changedTargetTouches.push(changedTouches[i]);
                        }
                        if (type === 'touchend' || type === 'touchcancel') {
                            delete targetIds[changedTouches[i].identifier];
                        }
                        i++;
                    }

                    if (!changedTargetTouches.length) {
                        return false;
                    }
                }
                targetTouches = uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true);
                var touchesLength = targetTouches.length;
                var changedTouchesLength = changedTargetTouches.length;
                if (type === 'touchstart' && touchesLength - changedTouchesLength === 0) { //first
                    touch.isFirst = true;
                    fly.gestures.touch = fly.gestures.session = {
                        target: event.target
                    };
                }
                touch.isFinal = ((type === 'touchend' || type === 'touchcancel') && (touchesLength - changedTouchesLength === 0));

                touch.touches = targetTouches;
                touch.changedTouches = changedTargetTouches;
                return true;

            };
            var handleTouchEvent = function(event) {
                var touch = {
                    gesture: event
                };
                var touches = getTouches(event, touch);
                if (!touches) {
                    return;
                }
                calTouchData(touch);
                detect(event, touch);
                fly.gestures.session.prevTouch = touch;
            };
            window.addEventListener('touchstart', handleTouchEvent);
            window.addEventListener('touchmove', handleTouchEvent);
            window.addEventListener('touchend', handleTouchEvent);
            window.addEventListener('touchcancel', handleTouchEvent);
        },{
           './Core': 3 ,
           './Utils' : 5,
           './OS': 12
        }
    ],
    14: [ // gestures.Drag
        function(require, module, exports) {
            
            var fly = require('./Core');
            var Utils = require('./Utils');
            var trigger = Utils.trigger;

            var handle = function(event, touch) {
                var session = fly.gestures.session,
                    name = 'drag';
                switch (event.type) {
                    case 'touchstart':
                        break;
                    case 'touchmove':
                        if (!touch.direction || !session.target) {
                            return;
                        }
                        //修正direction,可在session期间自行锁定拖拽方向，方便开发scroll类不同方向拖拽插件嵌套
                        if (session.lockDirection && session.startDirection) {
                            if (session.startDirection && session.startDirection !== touch.direction) {
                                if (session.startDirection === 'up' || session.startDirection === 'down') {
                                    touch.direction = touch.deltaY < 0 ? 'up' : 'down';
                                } else {
                                    touch.direction = touch.deltaX < 0 ? 'left' : 'right';
                                }
                            }
                        }

                        if (!session.drag) {
                            session.drag = true;
                            trigger(session.target, name + 'start', touch);
                        }
                        trigger(session.target, name, touch);
                        trigger(session.target, name + touch.direction, touch);
                        break;
                    case 'touchend' :
                    case 'touchcancel':
                        if (session.drag && touch.isFinal) {
                            trigger(session.target, name + 'end', touch);
                        }
                        break;
                }
            };

            fly.gestures.addGesture({
                name: 'drag',
                index: 20,
                handle: handle,
                options: {
                    fingers: 1
                }
            });
        },{
            './Core': 3,
            './Utils': 5
        }
    ],
    15: [ // gestures.Flick
        function(require, module, exports) {

            var fly = require('./Core');
            var Utils = require('./Utils');
            var trigger = Utils.trigger;

            var flickStartTime = 0;
            var handle = function(event, touch) {
                var session = fly.gestures.session,
                    name = 'flick';
                var options = this.options;
                var now = +new Date();
                switch (event.type) {
                    case 'touchmove':
                        if (now - flickStartTime > 300) {
                            flickStartTime = now;
                            session.flickStart = touch.center;
                        }
                        break;
                    case 'touchend':
                    case 'touchcancel':
                        touch.flick = false;
                        if (session.flickStart && options.flickMaxTime > (now - flickStartTime) && touch.distance > options.flickMinDistince) {
                            touch.flick = true;
                            touch.flickTime = now - flickStartTime;
                            touch.flickDistanceX = touch.center.x - session.flickStart.x;
                            touch.flickDistanceY = touch.center.y - session.flickStart.y;
                            trigger(session.target, name, touch);
                            trigger(session.target, name + touch.direction, touch);
                        }
                        break;
                }

            };
            fly.gestures.addGesture({
                name: 'flick',
                index: 5,
                handle: handle,
                options: {
                    flickMaxTime: 200,
                    flickMinDistince: 10
                }
            });
        },{
            './Core': 3,
            './Utils': 5
        }
    ],
    16: [ // gestures.Tap
        function(require, module, exports) {

            var fly = require('./Core');
            var Utils = require('./Utils');
            var trigger = Utils.trigger;

            var lastTarget;
            var lastTapTime;
            var handle = function(event, touch) {
                var session = fly.gestures.session;
                var options = this.options;
                switch (event.type) {
                    case 'touchend':
                        if (!touch.isFinal) {
                            return;
                        }
                        var target = session.target;
                        if (!target || (target.disabled || (target.classList && target.classList.contains('disabled')))) {
                            return;
                        }
                        if (touch.distance < options.tapMaxDistance && touch.deltaTime < options.tapMaxTime) {
                            if (lastTarget && (lastTarget === target)) { //same target
                                if (lastTapTime && (touch.timestamp - lastTapTime) < options.tapMaxInterval) {
                                    trigger(target, 'doubletap', touch);
                                    lastTapTime = +new Date;
                                    lastTarget = target;
                                    return;
                                }
                            }
                            trigger(target, 'tap', touch);
                            lastTapTime = +new Date();
                            lastTarget = target;
                        }
                        break;
                }
            };
            fly.gestures.addGesture({
                name: 'tap',
                index: 30,
                handle: handle,
                options: {
                    fingers: 1,
                    tapMaxInterval: 300,
                    tapMaxDistance: 5,
                    tapMaxTime: 250
                }
            });
        }, {
            './Core': 3,
            './Utils': 5
        }
    ]
}, {}, [9]);