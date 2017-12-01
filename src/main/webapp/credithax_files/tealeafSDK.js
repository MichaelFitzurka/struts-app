if (typeof TeaLeaf !== "undefined" && ((typeof TeaLeaf.replay === "function") ? !TeaLeaf.replay() : !TeaLeaf.replay) && TeaLeaf.Configuration && !TeaLeaf.Configuration.tlinit) {
    TeaLeaf.Configuration.tlinit = true;
    if (!TeaLeaf.tlBrowser) {
        TeaLeaf.tlBrowser = {
            UNKNOWN: true
        };
    }
    if (!TeaLeaf.$C) {
        TeaLeaf.$C = function(b) {
            return b;
        };
    }
    if (!Array.prototype.push) {
        Array.prototype.stackEnd = 0;
        Array.prototype.push = function(b) {
            this[this.stackEnd] = b;
            this.stackEnd++;
        };
    }
    if (!Array.prototype.pop) {
        Array.prototype.pop = function() {
            this.stackEnd--;
            return this[this.stackEnd];
        };
    }
    TeaLeaf.trim = function(b) {
        if (!b || !b.toString) {
            return "";
        }
        return b.toString().replace(/^\s+|\s+$/g, "");
    };
    TeaLeaf.ltrim = function(b) {
        if (!b || !b.toString) {
            return "";
        }
        return b.toString().replace(/^\s+/, "");
    };
    TeaLeaf.rtrim = function(b) {
        if (!b || !b.toString) {
            return "";
        }
        return b.toString().replace(/\s+$/, "");
    };
    TeaLeaf.extend = function(d, f) {
        var e;
        if (!f || typeof f !== "object") {
            f = {};
        }
        if (!d || typeof d !== "object") {
            return f;
        }
        for (e in d) {
            if (d.hasOwnProperty(e)) {
                if (typeof d[e] !== "object" || d[e] === null) {
                    f[e] = d[e];
                } else {
                    f[e] = (Object.prototype.toString.call(d[e]) === "[object Array]") ? [] : {};
                    TeaLeaf.extend(d[e], f[e]);
                }
            }
        }
        return f;
    };
    TeaLeaf.serializeEventsToXML = (function() {
        var c = 1,
            d = function(o, a) {
                var n, l = [],
                    i = 0,
                    b, p = [],
                    m;
                if (!o || typeof a !== "object") {
                    return "";
                }
                o = TeaLeaf.Event.tlFormatXMLName(o);
                p.push("<" + o);
                for (b in a) {
                    if (!a.hasOwnProperty(b) || a[b] === m || a[b] === "" || a[b] === null) {
                        continue;
                    }
                    if (typeof a[b] === "object") {
                        l.push(d(b, a[b]));
                    } else {
                        p.push(TeaLeaf.Event.tlFormatXMLName(b) + '="' + TeaLeaf.Event.tlFormatXMLValue(a[b].toString()) + '"');
                    }
                }
                i = l.length;
                if (i) {
                    p.push(">");
                    for (n = 0; n < i; n++) {
                        p.push(l[n]);
                    }
                    p.push("</" + o + ">");
                } else {
                    p.push("/>");
                }
                return p.join(" ");
            };
        return function(b) {
            var a, h = TeaLeaf.Event.tlGetPageId(),
                g = [];
            g.push('<ClientEventSet PostTimeStamp="' + (new Date()).getTime() + '">');
            while (!b.isEmpty()) {
                a = b.dequeue();
                if (typeof a !== "object") {
                    continue;
                }
                a.count = c++;
                a.PageID = h;
                g.push(d("ClientEvent", a));
            }
            g.push("</ClientEventSet>");
            return g.join("\n");
        };
    });
    TeaLeaf.XHRFactory = (function() {
        var d, c;
        c = 30000;
        d = function(a) {
            if ((a >= 200 && a < 300) || a === 304) {
                return true;
            }
            return false;
        };
        return {
            createXHRObject: function() {
                var e, h, a;
                h = [function() {
                    return new XMLHttpRequest();
                }, function() {
                    return new ActiveXObject("Msxml2.XMLHTTP.6.0");
                }, function() {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                }];
                for (e = 0; e < h.length; e++) {
                    try {
                        a = h[e]();
                    } catch (b) {
                        continue;
                    }
                    if (a) {
                        this.createXHRObject = h[e];
                        return a;
                    }
                }
                return null;
            },
            xhrRequest: function(p, i, t, o, a, e, b) {
                var r, s;
                if (!p || !i) {
                    return null;
                }
                p = p.toUpperCase();
                if (!b) {
                    b = this.createXHRObject();
                }
                if (!b) {
                    return null;
                }
                if (a) {
                    b.onreadystatechange = function() {
                        var f, g;
                        try {
                            switch (b.readyState) {
                                case 0:
                                    break;
                                case 1:
                                    break;
                                case 2:
                                    if (e && e.loaded) {
                                        try {
                                            f = b.status;
                                            g = b.statusText;
                                        } catch (h) {
                                            if (!f) {
                                                f = 0;
                                            }
                                            if (!g) {
                                                g = "None";
                                            }
                                        } finally {
                                            e.loaded(f, g);
                                        }
                                    }
                                    break;
                                case 3:
                                    break;
                                case 4:
                                    TeaLeaf.XHRFactory.deleteXHRObj(b);
                                    if (d(b.status)) {
                                        if (e && e.success) {
                                            e.success(b.responseText, b.responseXML);
                                        }
                                    } else {
                                        if (e && e.failure) {
                                            e.failure(b.status, b.statusText);
                                        }
                                    }
                                    break;
                                default:
                                    break;
                            }
                        } catch (j) {}
                    };
                }
                b.open(p, i, a);
                if (t) {
                    for (r = 0; r < t.length; r++) {
                        b.setRequestHeader(t[r].name, t[r].value);
                    }
                }
                if (p !== "POST" || !o) {
                    o = null;
                }
                if (a) {
                    try {
                        s = setTimeout(function() {
                            TeaLeaf.XHRFactory.deleteXHRObj(b);
                        }, c);
                        b.timeoutID = s;
                    } catch (q) {}
                }
                b.send(o);
                return b;
            },
            deleteXHRObj: function(a) {
                a.onreadystatechange = function() {};
                if (a && a.readyState !== 4) {
                    if (a.abort) {
                        a.abort();
                    }
                }
                if (a.timeoutID) {
                    clearTimeout(a.timeoutID);
                    a.timeoutID = null;
                }
            }
        };
    });
    TeaLeaf.Queue = function() {
        if (!(this instanceof TeaLeaf.Queue)) {
            return new TeaLeaf.Queue();
        }
        this._q = [];
        this.size = 0;
    };
    TeaLeaf.Queue.prototype = {
        enqueue: function(b) {
            if (typeof b === "undefined") {
                return this.size;
            }
            this.size = this._q.push(b);
            return this.size;
        },
        dequeue: function() {
            var b = this._q.shift();
            this.size = this._q.length;
            return b;
        },
        isEmpty: function() {
            return !this.size;
        }
    };
    TeaLeaf.eventQ = new TeaLeaf.Queue();
    TeaLeaf.Request = function() {
        var e, h, g, f;
        e = h = f = null;
        g = "POST";
        this.getUrl = function() {
            var a, c, d, b, j;
            if (f) {
                return f;
            }
            a = TeaLeaf.Configuration;
            b = window.location;
            j = b.protocol;
            d = j + "//" + b.host;
            if (j === "http:") {
                c = a.tlurl;
            } else {
                c = a.tlsecureurl;
            }
            if (c.substr(0, 1) === "/") {
                d += c;
            } else {
                d += b.pathname.substr(0, b.pathname.lastIndexOf("/") + 1) + c;
            }
            return d;
        };
        this.setUrl = function(a) {
            f = a;
        };
        this.getMethod = function() {
            return g;
        };
        this.setMethod = function(a) {
            g = a;
        };
        this.getData = function() {
            return e;
        };
        this.setData = function(b) {
            var a;
            e = b;
            if (e) {
                a = TeaLeaf.Request.totalDataLength || 0;
                a += e.length;
                TeaLeaf.Request.totalDataLength = a;
            }
        };
        this.getHeaders = function() {
            return h;
        };
        this.setHeaders = function(a) {
            h = a;
        };
        this.clear = function() {
            e = h = f = null;
        };
    };
    TeaLeaf.Request.prototype = {
        send: function(k) {
            var j, p, e, o, l, m;
            l = TeaLeaf.Configuration;
            if (!l.xd_iframeID) {
                m = TeaLeaf.XHRFactory.xhrRequest(this.getMethod(), this.getUrl(), this.getHeaders(), this.getData(), l.xhrAsync, k);
                if (!m) {
                    if (k && k.failure) {
                        k.failure(0, "XHR request failed!");
                    }
                    return;
                }
            } else {
                try {
                    j = document.getElementById(l.xd_iframeID);
                    if (!j || !j.contentWindow) {
                        if (k && k.failure) {
                            k.failure(0, "Could not retrive cross-domain iframe target!");
                        }
                        return;
                    }
                    p = j.contentWindow;
                    if (p.postMessage && window.JSON && 0) {} else {
                        o = p.TeaLeaf;
                        if (o && o.Request) {
                            e = new o.Request();
                            e.clear();
                            this.setUrl(e.getUrl());
                            e.setHeaders(this.getHeaders());
                            e.setData(this.getData());
                            e.send(k);
                        }
                    }
                } catch (n) {
                    if (k && k.failure) {
                        k.failure(0, (n.name ? (n.name + ": " + n.message) : n.toString()));
                    }
                    return;
                }
            }
        }
    };
    TeaLeaf.Request.GetTotalDataLength = function() {
        var b;
        b = TeaLeaf.Request.totalDataLength || 0;
        return b;
    };
    TeaLeaf.sendData = function(l, i) {
        var h = window.TeaLeaf,
            j, k, g;
        if (!l) {
            return -1;
        }
        i = i || "text/plain";
        g = new h.Request();
        if (!g) {
            return -1;
        }
        g.clear();
        g.setData(l);
        k = [{
            name: "X-TeaLeaf",
            value: "ClientEvent"
        }, {
            name: "Content-Type",
            value: i
        }];
        k = k.concat(h.Event.tlGetHTTPHeaders(h.Event.Configuration.tlHTTPRequestHeadersSet));
        if (h.Event.Configuration.tlinitflag && !h.Event.InitHeadersSent) {
            k = k.concat(h.Event.tlGetHTTPHeaders(h.Event.Configuration.tlHTTPRequestHeadersEvalInit));
            h.Event.InitHeadersSent = true;
        }
        if (h.Event.SendUnloadHeaders && !h.Event.UnloadHeadersSent) {
            k = k.concat(h.Event.tlGetHTTPHeaders(h.Event.Configuration.tlHTTPRequestHeadersEvalBeforeUnload));
            h.Event.UnloadHeadersSent = true;
        }
        g.setHeaders(k);
        j = {
            loaded: function(b, a) {
                if (h.tlGetCookieValue("tlQueuedXML")) {
                    h.tlEraseCookie("tlQueuedXML");
                }
            },
            failure: function(b, a) {
                if (b < 200 && !h.Event.Configuration.tlignoresendfailure) {
                    h.Event.Configuration.tlignoresendfailure = true;
                    h.Event.tlErrorHandler("XHR failure - Status " + b + ": " + a, g.getUrl());
                }
            },
            success: function(b, a) {
                h.Event.Configuration.tlignoresendfailure = false;
            }
        };
        h.Event.Configuration.tlignoresendfailure = true;
        g.send(j);
        return 0;
    };
    TeaLeaf.makeRandomString = function(i, j) {
        var f, g, h;
        if (!i || i <= 0) {
            return;
        }
        if (!j) {
            j = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890~!@$-";
        }
        h = "";
        for (f = 0; f < i; f++) {
            g = Math.floor(Math.random() * j.length);
            h += j.charAt(g);
        }
        return h;
    };
    TeaLeaf.getNodeType = function(d) {
        var f, e;
        if (!d) {
            return "";
        }
        f = d.nodeName ? d.nodeName.toLowerCase() : "";
        e = "";
        if (f === "input" || f === "object" || f === "script") {
            e = d.type ? d.type.toLowerCase() : "";
        }
        return e;
    };
    TeaLeaf.tLoadObjs = [];
    TeaLeaf.addOnLoad = function(c, d) {
        if (arguments.length === 1) {
            TeaLeaf.tLoadObjs.push(c);
        } else {
            if (arguments.length > 1) {
                TeaLeaf.tLoadObjs.push(c[d]);
            }
        }
    };
    TeaLeaf.tlSetCookie = function(g, k, h, i, l, j) {
        if (!g) {
            return;
        }
        document.cookie = g + "=" + k + (h ? (";expires=" + h.toUTCString()) : "") + ";path=" + (i || "/") + (l ? (";domain=" + l) : "") + (j ? ";secure" : "");
    };
    TeaLeaf.tlGetCookieValue = function(h) {
        var c, i, l, k, j;
        j = h + "=";
        k = null;
        l = document.cookie.split(";");
        for (c = 0; c < l.length; c++) {
            i = TeaLeaf.ltrim(l[c]);
            if (i.indexOf(j) === 0) {
                k = i.substring(j.length, i.length);
                break;
            }
        }
        return k;
    };
    TeaLeaf.tlEraseCookie = function(c) {
        var d;
        d = new Date(1970, 1, 1);
        TeaLeaf.tlSetCookie(c, "", d);
    };
    TeaLeaf.tlBrowserIsIE = function() {
        var b;
        b = TeaLeaf.tlBrowser;
        if (b) {
            return !!b.MSIE;
        }
        return false;
    };
    TeaLeaf.tlBrowserIsMozilla = function() {
        var b;
        b = TeaLeaf.tlBrowser;
        if (b) {
            return !!b.MOZILLA;
        }
        return false;
    };
    TeaLeaf.tlBrowserIsWebKit = function() {
        var b;
        b = TeaLeaf.tlBrowser;
        if (b) {
            return !!b.WEBKIT;
        }
        return false;
    };
    TeaLeaf.tlBrowserIsAndroid = function() {
        var b;
        b = TeaLeaf.tlBrowser;
        if (b) {
            return !!b.ANDROID;
        }
        return false;
    };
    TeaLeaf.tlBrowserIsOpera = function() {
        var b;
        b = TeaLeaf.tlBrowser;
        if (b) {
            return !!b.OPERA;
        }
        return false;
    };
    TeaLeaf.tlBrowserIsUnknown = function() {
        var b;
        b = TeaLeaf.tlBrowser;
        if (b) {
            return !!b.UNKNOWN;
        }
        return false;
    };
    (function() {
        var r = TeaLeaf,
            j = r.Client,
            n = r.Configuration,
            m = r.Event,
            p = null,
            l = true,
            q = false,
            k = m.Configuration.tlmaxeventcount,
            o = false;
        r.tlDisable = function() {
            l = false;
            if ((o || n.tlDisableIfInactive) && !q) {
                try {
                    m.tlFlushQueue(true);
                    j.tlDetachFromAllControls();
                    TeaLeaf.Event.tlRemoveHandler(window, "beforeunload", TeaLeaf.Event.tlBeforeUnload, false);
                    TeaLeaf.Event.tlRemoveHandler(window, "unload", TeaLeaf.Event.tlUnload, false);
                } catch (a) {}
                q = true;
            }
        };
        r.activitySinceDisabled = function() {
            return l;
        };
        r.tlKeepAlive = function() {
            if (p) {
                window.clearTimeout(p);
                p = null;
            }
            if (o || r.Event.getEventCount() >= k) {
                o = true;
                r.tlDisable();
                r.tlKeepAlive = function() {};
                return;
            }
            if (!q && n.tlActivityTimeout) {
                p = window.setTimeout(function() {
                    r.tlDisable();
                }, (n.tlActivityTimeout * 60000));
            }
            if (!l) {
                l = true;
            }
        };
    }());
    TeaLeaf.PageSetup = function() {
        var t, e, v, q, i, w, u, o, r, x;
        if (document.readyState && document.readyState !== "complete") {
            return;
        }
        u = TeaLeaf;
        o = u.Configuration;
        r = o.tlGUIDCookie;
        if (u.PageSetup.Complete) {
            return;
        }
        u.PageSetup.Complete = true;
        if (u.PageSetup.Cleanup) {
            u.PageSetup.Cleanup();
        }
        u.tlBrowser.UNKNOWN = false;
        x = navigator.userAgent.toLowerCase();
        if (/opera|presto/i.test(x)) {
            u.tlBrowser.OPERA = true;
        } else {
            if (/android/i.test(x)) {
                u.tlBrowser.ANDROID = true;
            } else {
                if (/(apple)?webkit|safari|chrome/i.test(x)) {
                    u.tlBrowser.WEBKIT = true;
                } else {
                    if (/msie|trident/i.test(x)) {
                        u.tlBrowser.MSIE = true;
                    } else {
                        if (/mozilla|gecko|firefox/i.test(x)) {
                            u.tlBrowser.MOZILLA = true;
                        } else {
                            u.tlBrowser.UNKNOWN = true;
                        }
                    }
                }
            }
        }
        if (o.xd_CommonDomain) {
            try {
                document.domain = o.xd_CommonDomain;
            } catch (s) {}
        }
        if (o.xd_iframeID) {
            try {
                q = document.getElementById(o.xd_iframeID);
                if (!q) {
                    i = ((window.location.protocol === "http:") ? o.xd_iframeSrcURL : o.xd_iframeSrcURLSecure);
                    if (i) {
                        q = document.createElement("IFRAME");
                        if (q) {
                            q.id = o.xd_iframeID;
                            q.src = i;
                            q.style.display = "none";
                            q.style.visibility = "hidden";
                            document.body.appendChild(q);
                        }
                    }
                }
            } catch (p) {}
        }
        if (o.tlSetGUID) {
            if (!r || !r.name) {} else {
                if (!r.valueLength) {
                    r.valueLength = 32;
                }
                if (!r.valueSet) {
                    r.valueSet = "0123456789ABCDEF";
                }
                e = u.tlGetCookieValue(r.name);
                if (!e) {
                    w = new Date();
                    e = u.makeRandomString(r.valueLength, r.valueSet);
                    v = r.expires ? new Date(w.getTime() + r.expires * 60 * 1000) : null;
                    u.tlSetCookie(r.name, e, v, r.path, r.domain, r.secure);
                }
            }
        }
        if (!o.tlSDK) {
            for (t = 0; t < u.tLoadObjs.length; t++) {
                u.tLoadObjs[t]();
            }
        }
        u.EndLoad = new Date();
    };
    if (document.readyState === "complete") {
        TeaLeaf.PageSetup();
    } else {
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", TeaLeaf.PageSetup, false);
            window.addEventListener("load", TeaLeaf.PageSetup, false);
            TeaLeaf.PageSetup.Cleanup = function() {
                var b;
                b = TeaLeaf;
                document.removeEventListener("DOMContentLoaded", b.PageSetup, false);
                window.removeEventListener("load", b.PageSetup, false);
            };
        } else {
            if (document.attachEvent) {
                document.attachEvent("onreadystatechange", TeaLeaf.PageSetup);
                window.attachEvent("onload", TeaLeaf.PageSetup);
                TeaLeaf.PageSetup.Cleanup = function() {
                    var b;
                    b = TeaLeaf;
                    document.detachEvent("onreadystatechange", b.PageSetup);
                    window.detachEvent("onload", b.PageSetup);
                };
            } else {
                if (typeof window.onload === "function") {
                    TeaLeaf.OnLoad = window.onload;
                } else {
                    TeaLeaf.OnLoad = null;
                }
                window.onload = function() {
                    var b;
                    b = TeaLeaf;
                    b.PageSetup();
                    window.onload = b.OnLoad;
                    if (b.OnLoad) {
                        b.OnLoad();
                    }
                };
            }
        }
    }
}
if (window.TeaLeaf && ((typeof TeaLeaf.replay === "function") ? !TeaLeaf.replay() : !TeaLeaf.replay) && TeaLeaf.Event && TeaLeaf.Event.Configuration) {
    TeaLeaf.Event.tlQueuedXML = "";
    TeaLeaf.Event.tlWindowObjects = [{
        tlWindowName: "",
        tlWindowObject: ""
    }];
    TeaLeaf.Event.queuedEventTypes = {};
    (function() {
        var b = 0;
        TeaLeaf.Event.setEventCount = function(a) {
            if (typeof a === "number") {
                b = a;
            }
            return b;
        };
        TeaLeaf.Event.getEventCount = function() {
            return b;
        };
    }());
    TeaLeaf.Event.createBaseEvent = function(e, f) {
        var d;
        d = {
            type: (e ? e.toString() : null),
            subType: (f ? f.toString() : null),
            timeDuration: 0
        };
        return d;
    };
    TeaLeaf.Event.createExceptionEvent = (function() {
        var b;
        b = TeaLeaf.Event.createBaseEvent(TeaLeaf.$C("INFO"), TeaLeaf.$C("EXCEPTION"));
        return function(g, h, a) {
            var e;
            e = TeaLeaf.extend(b, {
                message: g,
                url: h,
                line: a
            });
            e.timeDuration = TeaLeaf.Event.tlDateDiff(new Date());
            TeaLeaf.Event.queuedEventTypes.EXCEPTION = true;
            return e;
        };
    }());
    TeaLeaf.Event.createCustomEvent = function(f, e) {
        var d;
        d = TeaLeaf.Event.createBaseEvent("UIEventAppInfo", f);
        d.timeDuration = TeaLeaf.Event.tlDateDiff(new Date());
        TeaLeaf.Event.queuedEventTypes.CUSTOM = true;
        return TeaLeaf.extend(e, d);
    };
    TeaLeaf.Event.createPerformanceEvent = function(d, e) {
        var f;
        f = TeaLeaf.Event.createBaseEvent("PERFORMANCE", d);
        f.timeDuration = TeaLeaf.Event.tlDateDiff(new Date());
        TeaLeaf.Event.queuedEventTypes.PERFORMANCE = true;
        return TeaLeaf.extend(e, f);
    };
    TeaLeaf.Event.createGuiEvent = function(g, h) {
        var e = window.TeaLeaf,
            f;
        f = e.Event.createBaseEvent("GUI", g);
        f.timeDuration = e.Event.tlDateDiff(new Date());
        e.Event.queuedEventTypes.GUI = true;
        return e.extend(h, f);
    };
    TeaLeaf.Event.tlGetTeaLeafXEvent = function() {
        var b = TeaLeaf.$C("ClientEvent");
        return b;
    };
    TeaLeaf.Event.tlEventType = function() {
        var d, f = "",
            e;
        if (typeof TeaLeaf.Event.queuedEventTypes !== "object") {
            return "";
        }
        e = TeaLeaf.Event.queuedEventTypes;
        for (d in e) {
            if (e.hasOwnProperty(d)) {
                f += d + "; ";
            }
        }
        TeaLeaf.Event.queuedEventTypes = {};
        return f;
    };
    TeaLeaf.Event.tlEventSubType = function() {
        var b;
        b = TeaLeaf.Event.SetSubType;
        TeaLeaf.Event.SetSubType = "";
        return b;
    };
    TeaLeaf.Event.tlGetUrlPath = function() {
        var b = window.location.pathname;
        return b;
    };
    TeaLeaf.Event.tlGetJSVersion = function() {
        return TeaLeaf.Configuration.tlversion;
    };
    TeaLeaf.Event.tlResolutionType = function(g, f) {
        var h, e = TeaLeaf.Event.Configuration.tlResolution;
        for (h = 0; h < e.length; h++) {
            if (g <= e[h].width || f <= e[h].height) {
                return e[h].type;
            }
        }
        return e[e.length - 1].type;
    };
    TeaLeaf.Event.tlResolutionTypeBrowser = function() {
        var h, g, e = 0,
            f = 0;
        if (window.innerWidth) {
            e = window.innerWidth;
            f = window.innerHeight;
        } else {
            if (document.documentElement && document.documentElement.clientWidth) {
                e = document.documentElement.clientWidth;
                f = document.documentElement.clientHeight;
            } else {
                if (document.body && document.body.clientWidth) {
                    e = document.body.clientWidth;
                    f = document.body.clientHeight;
                } else {
                    h = document.getElementsByTagName("body");
                    if (h.length > 0) {
                        e = h[0].clientWidth;
                        f = h[0].clientHeight;
                    }
                }
            }
        }
        g = TeaLeaf.Event.tlResolutionType(e, f);
        return g;
    };
    TeaLeaf.Event.tlGetRenderTime = function() {
        return TeaLeaf.Event.PageLoadMilliSecs;
    };
    TeaLeaf.Event.tlGetElementCount = function(b) {
        return document.getElementsByName(b).length;
    };
    TeaLeaf.Event.tlBadImageCount = function() {
        var j, h, i, g, f;
        h = 0;
        i = document.images;
        f = i.length;
        for (j = 0; j < f; j++) {
            g = i[j];
            if ((!g) || (typeof g.complete === "boolean" && !g.complete) || (typeof g.naturalWidth !== "undefined" && g.naturalWidth === 0)) {
                h++;
                continue;
            }
        }
        return h;
    };
    TeaLeaf.Event.tlFlashSend = function(p, r, i, o) {
        var q = window.TeaLeaf,
            l, m, n = q.Event.createBaseEvent(p, r),
            j = i.split(o);
        n.timeDuration = q.Event.tlDateDiff(new Date());
        for (l = 0, m = j.length - 1; l < m; l += 2) {
            n[j[l]] = j[l + 1];
        }
        q.eventQ.enqueue(n);
        q.tlKeepAlive();
    };
    TeaLeaf.Event.tlShowFlashDebug = function(f, g) {
        var h, e;
        g += "<BR>";
        for (h = 0; h < TeaLeaf.Event.tlWindowObjects.length; h++) {
            if (TeaLeaf.Event.tlWindowObjects[h].tlWindowName === f) {
                if (TeaLeaf.Event.tlWindowObjects[h].tlWindowObject.closed) {
                    TeaLeaf.Event.tlWindowObjects[h].tlWindowObject = window.open("", f, "width=600,height=300,scrollbars=yes,resizable=yes");
                }
                TeaLeaf.Event.tlWindowObjects[h].tlWindowObject.document.writeln(g.fontsize(2));
                TeaLeaf.Event.tlWindowObjects[h].tlWindowObject.scrollTo(0, 50000);
                return;
            }
        }
        e = window.open("", f, "width=600,height=300,scrollbars=yes,resizable=yes");
        TeaLeaf.Event.tlWindowObjects.push({
            tlWindowName: f,
            tlWindowObject: e
        });
        e.document.writeln(g.fontsize(2));
    };
    TeaLeaf.Event.tlSetEventCount = function(b) {
        TeaLeaf.Event.Configuration.tleventcount = b;
    };
    TeaLeaf.Event.tlGetEventCount = function() {
        return TeaLeaf.Event.Configuration.tleventcount;
    };
    TeaLeaf.Event.tlGetExceptionCount = function() {
        return (TeaLeaf.Event.Configuration.tlcatcherrors ? TeaLeaf.Event.Configuration.tlexceptioncount : null);
    };
    TeaLeaf.Event.tlGetDwellTime = function() {
        return TeaLeaf.Event.tlDateDiff(TeaLeaf.Event.Configuration.tllastdwelltime);
    };
    TeaLeaf.Event.tlGetLastVisitedElementID = function() {
        return TeaLeaf.Event.Configuration.tlidoflastvisitedcontrol;
    };
    TeaLeaf.Event.tlDateDiff = function(f, d) {
        var e = TeaLeaf.tlStartLoad.getTime();
        f = f || e;
        d = d || e;
        return Math.abs(f - d);
    };
    TeaLeaf.Event.tlGetVisitOrder = function() {
        return TeaLeaf.Event.Configuration.tlvisitorder;
    };
    TeaLeaf.Event.tlFormatXMLValue = function(b) {
        if (b && typeof b === "string") {
            if (b.replace) {
                return b.replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            }
            return b;
        }
        return "";
    };
    TeaLeaf.Event.tlGetHTTPHeaders = function(tlheaderconfig) {
        var i, headers, value;
        headers = [];
        for (i = 0; i < tlheaderconfig.length; i++) {
            if (tlheaderconfig[i].tlsethttpheader) {
                value = eval(tlheaderconfig[i].tlreqhttpheadervalue);
                if (value) {
                    headers.push({
                        name: tlheaderconfig[i].tlreqhttpheadername,
                        value: value
                    });
                }
            }
        }
        return headers;
    };
    TeaLeaf.Event.tlGetPageId = function() {
        if (TeaLeaf.Event.Configuration.tlpageid) {
            return TeaLeaf.Event.Configuration.tlpageid;
        }
        if (window.TeaLeaf_PageID) {
            TeaLeaf.Event.Configuration.tlpageid = TeaLeaf_PageID;
            return TeaLeaf.Event.Configuration.tlpageid;
        }
        TeaLeaf.Event.Configuration.tlpageid = "ID" + TeaLeaf.tlStartLoad.getHours() + "H" + TeaLeaf.tlStartLoad.getMinutes() + "M" + TeaLeaf.tlStartLoad.getSeconds() + "S" + TeaLeaf.tlStartLoad.getMilliseconds() + "R" + Math.random();
        return TeaLeaf.Event.Configuration.tlpageid;
    };
    TeaLeaf.Event.tlAddHandler = function(g, h, j, e) {
        try {
            if (!g) {
                return;
            }
            if (g.addEventListener) {
                g.addEventListener(h, j, e);
            } else {
                if (g.attachEvent) {
                    g.attachEvent("on" + h, j);
                }
            }
        } catch (i) {}
    };
    TeaLeaf.Event.tlRemoveHandler = function(g, h, j, e) {
        try {
            if (!g) {
                return;
            }
            if (g.removeEventListener) {
                g.removeEventListener(h, j, e);
            } else {
                if (g.detachEvent) {
                    g.detachEvent("on" + h, j);
                }
            }
        } catch (i) {}
    };
    TeaLeaf.Event.tlFlushQueue = (function() {
        var f, e = 1,
            d = (typeof TeaLeaf.Event.Configuration.jsonSerializer === "function") ? true : false;
        f = d ? "application/json" : "text/xml";
        return function(b) {
            var j = window.TeaLeaf,
                c = {
                    version: "0.0.0.3",
                    serialNumber: e,
                    sessions: [{
                        id: j.Event.tlGetPageId(),
                        startTime: j.tlStartLoad.getTime(),
                        messages: [],
                        meta: {
                            libVersion: j.Event.tlGetJSVersion(),
                            page: window.location.href,
                            windowId: j.Env.getWindowId(),
                            screen: {
                                width: window.screen.width,
                                height: window.screen.height,
                                orientation: window.orientation || 0
                            }
                        }
                    }]
                },
                a = j.eventQ.size,
                i = "";
            if (j.eventQ.isEmpty()) {
                return;
            }
            if (!b && a < j.Event.Configuration.tlqueuemaxevents) {
                return;
            }
            if (d) {
                while (!j.eventQ.isEmpty()) {
                    c.sessions[0].messages.push(j.eventQ.dequeue());
                }
                i = j.Event.Configuration.jsonSerializer(c);
            } else {
                i = j.serializeEventsToXML(j.eventQ);
            }
            j.Event.tlSetEventCount(a);
            j.sendData(i, f);
            e += 1;
        };
    }());
    TeaLeaf.Event.tlGetAlertCount = function() {
        var d, f, e;
        d = TeaLeaf;
        f = d.Event;
        e = f.getAlertCount ? f.getAlertCount() : 0;
        return e;
    };
    TeaLeaf.Event.tlErrorHandler = function(l, e, h) {
        try {
            var j = TeaLeaf.Event.Configuration,
                i;
            j.tlexceptioncount += 1;
            if (j.tlexceptioncount > j.tlmaxeventexception) {
                return false;
            }
            if ((typeof l !== "string") && !e) {
                return false;
            }
            h = h || 0;
            i = TeaLeaf.Event.createExceptionEvent(l, e, h);
            TeaLeaf.eventQ.enqueue(i);
        } catch (k) {}
        return false;
    };
    (function() {
        var n, l, j, o, k, m, p, i;
        n = TeaLeaf;
        l = n.Configuration;
        j = n.Client;
        o = j.Configuration;
        k = n.Event;
        m = k.Configuration;
        i = false;
        p = function(c) {
            var a, b = new Date(),
                d;
            if (i) {
                return;
            }
            if (!n.activitySinceDisabled()) {
                return;
            }
            if (o.tlIEhref) {
                o.tlIEhref = false;
                return;
            }
            i = true;
            j.tlSendKeys();
            j.tlSendResize();
            j.tlSendScroll(null, true);
            if (!l.xhrAsyncOnUnload) {
                l.xhrAsync = false;
            }
            if (o.tlStoreQueueInCookie) {
                b.setTime(b.getTime() + 300000);
                a = k.tlQueuedXML.replace(/(\r|\n)/g, "").replace(/;/g, "%3B");
                n.tlSetCookie("tlQueuedXML", a, b, "/");
            }
            m.tllastdwelltime = new Date();
            k.queuedEventTypes.PERFORMANCE = true;
            if (!k.SetSubType) {
                k.SetSubType = c;
            } else {
                k.SetSubType += "; " + c;
            }
            k.SendUnloadHeaders = true;
            d = TeaLeaf.Event.createPerformanceEvent(c, {
                MouseMove: j.tlHasUserMovement ? "True" : "False",
                Action: o.tlactiontype,
                VisitOrder: m.tlvisitorder,
                Alerts: k.tlGetAlertCount()
            });
            TeaLeaf.eventQ.enqueue(d);
            TeaLeaf.Event.tlFlushQueue(true);
            setTimeout(function() {
                i = false;
                l.xhrAsync = true;
                k.SendUnloadHeaders = false;
            }, 1000);
        };
        k.tlBeforeUnload = function() {
            p(n.$C("BEFOREUNLOAD"));
        };
        k.tlUnload = function() {
            j.tlDetachFromAllControls();
            p(n.$C("UNLOAD"));
        };
    }());
    TeaLeaf.Event.EventSetup = function() {
        var e, f, d;
        e = TeaLeaf;
        f = e.Event;
        d = f.Configuration;
        if (d.tlCatchAlerts) {
            (function() {
                var h, c, a, b;
                h = 0;
                if (window.alert && window.alert.apply) {
                    c = window.alert;
                    window.alert = function() {
                        var g;
                        g = c.apply(window, arguments);
                        h++;
                        return g;
                    };
                }
                if (window.confirm && window.confirm.apply) {
                    a = window.confirm;
                    window.confirm = function() {
                        var g;
                        g = a.apply(window, arguments);
                        h++;
                        return g;
                    };
                }
                if (window.prompt && window.prompt.apply) {
                    b = window.prompt;
                    window.prompt = function() {
                        var g;
                        g = b.apply(window, arguments);
                        h++;
                        return g;
                    };
                }
                f.getAlertCount = function() {
                    return h;
                };
            }());
        }
        if (TeaLeaf.Event.Configuration.tlcatcherrors) {
            if (typeof window.onerror !== "function") {
                window.onerror = TeaLeaf.Event.tlErrorHandler;
            }
        }
        TeaLeaf.Event.setupTimerRoutine();
        TeaLeaf.Event.Loaded = true;
    };
    TeaLeaf.Event.setupTimerRoutine = function(b) {
        b = b || TeaLeaf.Event.Configuration.tlqueueeventstimer;
        b = (b > 999) ? b : 1000;
        setTimeout(function() {
            TeaLeaf.Event.tlFlushQueue();
            TeaLeaf.Event.setupTimerRoutine();
        }, b);
    };
    TeaLeaf.Event.tlAddCustomEvent = function(e, d) {
        var f;
        if (!e || typeof e !== "string") {
            e = "custom";
        }
        if (!d || typeof d !== "object") {
            return;
        }
        f = TeaLeaf.Event.createCustomEvent(e, d);
        TeaLeaf.eventQ.enqueue(f);
    };
    if (!TeaLeaf.Event.Configuration.tlinit) {
        TeaLeaf.Event.Configuration.tlinit = true;
        TeaLeaf.addOnLoad(TeaLeaf.Event.EventSetup);
    }
}
if (window.TeaLeaf && ((typeof TeaLeaf.replay === "function") ? !TeaLeaf.replay() : !TeaLeaf.replay) && TeaLeaf.Env && TeaLeaf.Env.Configuration) {
    TeaLeaf.Env.tlSendPageSummary = function() {
        var h = window.TeaLeaf,
            f = h.Env,
            g, e = {
                info: f.getInfo(),
                document: f.getDocumentInfo(),
                window: f.getWindowInfo(),
                screen: f.getScreenInfo()
            };
        h.Event.queuedEventTypes.PERFORMANCE = true;
        h.Event.SetSubType = "INIT";
        g = h.Event.createPerformanceEvent("INIT", e);
        h.eventQ.enqueue(g);
        h.Event.PageLoadMilliSecs = g.timeDuration;
    };
    TeaLeaf.Env.getInfo = function() {
        var b = TeaLeaf.Event;
        return {
            version: b.tlGetJSVersion(),
            timezoneOffset: (new Date()).getTimezoneOffset()
        };
    };
    TeaLeaf.Env.getDocumentInfo = function(d) {
        var c = TeaLeaf;
        d = d || window.document;
        return {
            title: d.title,
            referer: d.referrer,
            contentType: d.contentType,
            lastModified: d.lastModified,
            characterSet: d.characterSet,
            width: d.width,
            height: d.height,
            anchors: d.anchors.length,
            embeds: (d.embeds ? d.embeds.length : 0),
            forms: d.forms.length,
            links: d.links.length,
            images: d.images.length,
            badImages: (c.tlBrowserIsWebKit() ? 0 : c.Event.tlBadImageCount()),
            plugins: (d.plugins ? d.plugins.length : 0)
        };
    };
    TeaLeaf.Env.getWindowInfo = (function() {
        var b;
        TeaLeaf.Env.getWindowId = function() {
            if (typeof window.sessionStorage === "object") {
                try {
                    b = sessionStorage.TLTWID;
                    if (!b) {
                        b = TeaLeaf.makeRandomString(6);
                        sessionStorage.TLTWID = b;
                    }
                } catch (a) {
                    b = null;
                }
            }
            return b;
        };
        return function() {
            var f = TeaLeaf,
                a = window.location,
                e;
            if (window.innerHeight && window.innerWidth) {
                e = window.innerWidth + "x" + window.innerHeight;
            } else {
                if (document.body && document.body.clientWidth && document.body.clientHeight) {
                    e = document.body.clientHeight + "x" + document.body.clientWidth;
                }
            }
            return {
                windowHref: escape(a.href),
                windowProtocol: a.protocol,
                windowHostName: a.hostname,
                windowPort: a.port,
                windowPathName: a.pathname,
                frames: window.frames.length,
                windowId: f.Env.getWindowId()
            };
        };
    }());
    TeaLeaf.Env.getScreenInfo = function() {
        var b = window.screen;
        return {
            width: b.width,
            height: b.height,
            availWidth: b.availWidth,
            availHeight: b.availHeight,
            availLeft: b.availLeft,
            availTop: b.availTop,
            colorDepth: b.colorDepth,
            pixelDepth: b.pixelDepth,
            deviceXDPI: b.deviceXDPI,
            deviceYDPI: b.deviceYDPI,
            logicalXDPI: b.logicalXDPI,
            logicalYDPI: b.logicalYDPI,
            left: b.left,
            top: b.top,
            fontSmoothingEnabled: b.fontSmoothingEnabled,
            updateInterval: b.updateInterval
        };
    };
    TeaLeaf.addOnLoad(TeaLeaf.Env.tlSendPageSummary);
}
if (window.TeaLeaf && ((typeof TeaLeaf.replay === "function") ? !TeaLeaf.replay() : !TeaLeaf.replay) && TeaLeaf.Client && TeaLeaf.Client.Configuration) {
    TeaLeaf.Client.tlTimeoutID = -1;
    TeaLeaf.Client.tlHasUserMovement = false;
    TeaLeaf.Client.tlUserMovement = function() {
        TeaLeaf.Client.tlHasUserMovement = true;
        TeaLeaf.Event.tlRemoveHandler(document, "mousemove", TeaLeaf.Client.tlUserMovement, false);
    };
    TeaLeaf.Client.EmptyMask = function() {
        return "";
    };
    TeaLeaf.Client.BasicMask = function(b) {
        if (!b || !b.value) {
            return null;
        }
        return "XXXXXX";
    };
    TeaLeaf.Client.PreserveMask = function(d) {
        var e, f;
        if (!d || !d.value) {
            return null;
        }
        e = TeaLeaf.Client.Configuration.tlPrivacyMask;
        f = d.value;
        f = f.replace(/[A-Z]/g, e.upperChar);
        f = f.replace(/[a-z]/g, e.lowerChar);
        f = f.replace(/[0-9]/g, e.numericChar);
        f = f.replace(/[^A-Za-z0-9]/g, e.symbolChar);
        return f;
    };
    TeaLeaf.Client.getFieldBlockMatch = function(j) {
        var f, h, i, g;
        i = TeaLeaf.Client.Configuration.tlFieldBlock;
        if (typeof j === "string") {
            j = document.getElementById(j);
        }
        if (!j) {
            return null;
        }
        for (f = 0; f < i.length; f++) {
            g = i[f];
            if (g.id) {
                if (!g.idRE) {
                    g.idRE = new RegExp(g.id, (g.caseinsensitive ? "i" : ""));
                }
                if (g.idRE.test(j.id)) {
                    return g;
                }
            }
            if (g.name) {
                if (!g.nameRE) {
                    g.nameRE = new RegExp(g.name, (g.caseinsensitive ? "i" : ""));
                }
                if (g.nameRE.test(j.name)) {
                    return g;
                }
            }
            if (g.className) {
                if (!g.classRE) {
                    g.classRE = new RegExp(g.className, (g.caseinsensitive ? "i" : ""));
                }
                if (g.classRE.test(j.className)) {
                    return g;
                }
            }
            if (g.attributeName && g.attributeValue) {
                h = j.getAttribute(g.attributeName);
                if (h) {
                    if (!g.attributeRE) {
                        g.attributeRE = new RegExp(g.attributeValue, (g.caseinsensitive ? "i" : ""));
                    }
                    if (g.attributeRE.test(h)) {
                        return g;
                    }
                }
            }
        }
        return null;
    };
    TeaLeaf.Client.tlIsReplace = function(b) {
        if (typeof b === "string") {
            b = document.getElementById(b);
        }
        if (!b) {
            return false;
        }
        if (TeaLeaf.Client.getFieldBlockMatch(b)) {
            return true;
        }
        if (TeaLeaf.getNodeType(b) === "password") {
            return TeaLeaf.Client.Configuration.tlpassword === 2;
        }
        return false;
    };
    TeaLeaf.Client.tlReplaceValue = function(d) {
        var c;
        if (typeof d === "string") {
            d = document.getElementById(d);
        }
        if (!d) {
            return null;
        }
        c = TeaLeaf.Client.getFieldBlockMatch(d);
        if (c) {
            return c.mask(d);
        }
        return d.value;
    };
    TeaLeaf.Client.tlIsExcluded = function(d) {
        var c;
        if (typeof d === "string") {
            d = document.getElementById(d);
        }
        if (!d) {
            return false;
        }
        c = TeaLeaf.Client.getFieldBlockMatch(d);
        if (c) {
            return c.exclude;
        }
        if (TeaLeaf.getNodeType(d) === "password") {
            return TeaLeaf.Client.Configuration.tlpassword === 2;
        }
        return false;
    };
    TeaLeaf.Client.tlGetName = function(f) {
        if (!f) {
            return null;
        }
        var d = f.id,
            e = f.name;
        if (d) {
            return d;
        }
        if (e) {
            return e;
        }
        return null;
    };
    TeaLeaf.Client.tlGetEventSource = function(c) {
        var d;
        d = null;
        if (!c) {
            return null;
        }
        if (c.srcElement) {
            d = c.srcElement;
        } else {
            d = c.target;
            if (!d) {
                d = c.explicitOriginalTarget;
            }
            if (!d) {
                d = c.originalTarget;
            }
        }
        if (d && d.tagName === "HTML") {
            return null;
        }
        if (d && !d.name) {
            if (d.parentNode && d.parentNode.tagName) {
                if (d.parentNode.tagName === "A" || d.parentNode.tagName === "LINK") {
                    d = d.parentNode;
                }
            }
        }
        if (!d || !d.tagName) {
            d = window.document.body;
        }
        return d;
    };
    TeaLeaf.Client.tlGetAnchor = function(f, d) {
        if (!f) {
            return null;
        }
        if (f.name) {
            return null;
        }
        var e;
        for (e = 0; e < document.anchors.length; e++) {
            if (document.anchors[e] === f) {
                if (d) {
                    return "<AnchorElement>" + e + "</AnchorElement>\r\n";
                } else {
                    return "Anchor-" + e;
                }
            }
        }
        for (e = 0; e < document.links.length; e++) {
            if (document.links[e] === f) {
                if (d) {
                    return "<LinkElement>" + e + "</LinkElement>\r\n";
                } else {
                    return "Link-" + e;
                }
            }
        }
        return null;
    };
    TeaLeaf.Client.checkIsInput = function(b) {
        if (typeof b === "string") {
            b = document.getElementById(b);
        }
        switch (b.tagName) {
            case "INPUT":
            case "SELECT":
            case "TEXTAREA":
                return true;
        }
        return false;
    };
    TeaLeaf.Event.tlFormatXMLName = function(g) {
        if (!g || g.length <= 0) {
            return null;
        }
        var h, f, e = "";
        if (!TeaLeaf.Event.tlNameStartChar(g.charCodeAt(0))) {
            e = "_";
        }
        f = g.length;
        for (h = 0; h < f; h++) {
            if (TeaLeaf.Event.tlNameChar(g.charCodeAt(h))) {
                e = e + g.charAt(h);
            } else {
                e = e + "_";
            }
        }
        return e;
    };
    TeaLeaf.Event.tlNameStartChar = function(b) {
        return (b >= 65 && b <= 90) || b === 95 || (b >= 97 && b <= 122) || (b >= 192 && b <= 214) || (b >= 216 && b <= 246) || (b >= 248 && b <= 767) || (b >= 880 && b <= 893) || (b >= 895 && b <= 8191) || (b >= 8204 && b <= 8205) || (b >= 8304 && b <= 8591) || (b >= 11264 && b <= 12271) || (b >= 12289 && b <= 55295) || (b >= 63744 && b <= 64975) || (b >= 65008 && b <= 65533);
    };
    TeaLeaf.Event.tlNameChar = function(b) {
        return TeaLeaf.Event.tlNameStartChar(b) || b === 45 || b === 46 || (b >= 48 && b <= 57) || b === 183 || (b >= 768 && b <= 879) || (b >= 8255 && b <= 8256);
    };
    TeaLeaf.Client.tlQueuedKeys = "";
    TeaLeaf.Client.getNormalizedKeyCode = function(c) {
        var d;
        if (!c || !c.keyCode || (c.keyCode < 32 && c.keyCode !== 8 && c.keyCode !== 20)) {
            return null;
        }
        d = "";
        if (c.ctrlKey) {
            d += "c-";
        }
        if (c.altKey) {
            d += "a-";
        }
        if (c.shiftKey) {
            d += "s-";
        }
        if (!TeaLeaf.tlBrowserIsIE()) {
            switch (c.keyCode) {
                case 59:
                    d += 186;
                    break;
                default:
                    d += c.keyCode;
                    break;
            }
        } else {
            d += c.keyCode;
        }
        return d;
    };
    TeaLeaf.Client.tlQueueKey = function(j) {
        var l, m, k, n, i, h;
        n = TeaLeaf;
        i = n.Client;
        h = i.Configuration;
        i.tlSendResize();
        i.tlSendScroll(null, true);
        if (!j) {
            j = window.event;
        }
        if (!i.tlQueuedKeysCount) {
            i.tlQueuedKeys = "";
            i.tlQueuedKeysCount = 0;
        }
        m = i.tlGetEventSource(j);
        if (!m) {
            return;
        }
        if (!m.TeaLeafFocusTime) {
            m.TeaLeafFocusTime = new Date();
        }
        if (i.tlQueuedKeySource) {
            if (i.tlQueuedKeySource !== m) {
                if (i.tlQueuedKeys && i.tlQueuedKeys.length > 0) {
                    i.tlSendKeys();
                }
                i.tlQueuedKeySource = m;
            }
        } else {
            i.tlQueuedKeySource = m;
        }
        l = i.tlGetName(m);
        if (!l) {
            l = i.tlGetXPathFromNode(m);
            if (!l) {
                if (!i.tlGetAnchor(m, false)) {
                    i.tlQueuedKeySource = null;
                }
                return;
            } else {
                i.tlQueuedKeySource = m;
            }
        } else {
            if (i.tlIsReplace(m)) {
                i.tlQueuedKeysCount++;
                return;
            }
            if (i.tlIsExcluded(m)) {
                i.tlQueuedKeys = "";
                i.tlQueuedKeysCount++;
                return;
            }
        }
        k = i.getNormalizedKeyCode(j);
        if (k) {
            if (i.tlQueuedKeys && i.tlQueuedKeys.length > 0) {
                i.tlQueuedKeys += ";";
            }
            i.tlQueuedKeys += k;
            i.tlQueuedKeysCount++;
        }
    };
    TeaLeaf.Client.tlSendKeys = function() {
        var A = window.TeaLeaf,
            q = A.Client,
            u, s, r, t, B, o, v, w, x, y, z, p;
        if (!q.tlQueuedKeySource || (!q.tlQueuedKeys && !q.tlQueuedKeysCount)) {
            return;
        }
        w = q.tlQueuedKeySource;
        v = q.tlQueuedKeys;
        o = q.tlQueuedKeysCount;
        q.tlQueuedKeySource = null;
        q.tlQueuedKeys = "";
        q.tlQueuedKeysCount = 0;
        x = q.tlGetXPathFromNode(w);
        if (!x && q.Configuration.tlDiscardInvalidXPath) {
            return;
        }
        p = !!q.tlIsReplace(w);
        u = !!q.tlIsExcluded(w);
        if (p || u) {
            v = null;
            o = 0;
        }
        B = A.Client.tlGetName(w);
        z = w.id;
        if (!A.Client.CheckIfIdValid(w)) {
            z = "";
        }
        r = {
            Name: w.name,
            Id: z,
            ElementType: A.getNodeType(w),
            TagName: w.tagName,
            XPath: x,
            KeyCount: o
        };
        t = {};
        if (p) {
            if (!t[B]) {
                t = {
                    ValueIn: B
                };
                t[B] = q.tlReplaceValue(w);
            }
        } else {
            y = A.Event.tlFormatXMLName(B);
            if (!y) {
                y = x;
                y = A.Event.tlFormatXMLName(y);
            }
            t = {
                KeyCode: v
            };
            if (w.value) {
                t.ValueIn = y;
                t[y] = w.value;
            }
        }
        s = A.Event.createGuiEvent("KeyUp", A.extend(t, r));
        A.eventQ.enqueue(s);
        A.tlKeepAlive();
    };
    TeaLeaf.Client.tlSendResize = function() {
        var d = window.TeaLeaf,
            f = d.Client,
            e;
        if (!f.ResizeClientX && !f.ResizeClientY) {
            return;
        }
        e = d.Event.createGuiEvent("Resize", {
            clientX: f.ResizeClientX,
            clientY: f.ResizeClientY,
            screenX: f.ResizeScreenX,
            screenY: f.ResizeScreenY
        });
        d.eventQ.enqueue(e);
        f.ResizeClientX = null;
        f.ResizeClientY = null;
        f.ResizeScreenX = null;
        f.ResizeScreenY = null;
    };
    TeaLeaf.Client.tlCheckScroll = function() {
        var c, d = TeaLeaf.Client.Configuration.tlWindowHandlers;
        for (c = 0; c < d.length; c++) {
            if (d[c].domevent === "scroll" && d[c].load) {
                return true;
            }
        }
        return false;
    };
    TeaLeaf.Client.tlSendScroll = function(l, k) {
        var h, j, m = 0,
            i = 0,
            n;
        l = l || window.event;
        if (!TeaLeaf.Client.tlCheckScroll()) {
            return;
        }
        if (typeof window.pageYOffset === "number") {
            i = window.pageYOffset;
            m = window.pageXOffset;
        } else {
            if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
                i = document.body.scrollTop;
                m = document.body.scrollLeft;
            } else {
                if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
                    i = document.documentElement.scrollTop;
                    m = document.documentElement.scrollLeft;
                }
            }
        }
        if (TeaLeaf.Client.Configuration.tlScrollOffsetX === 0) {
            TeaLeaf.Client.Configuration.tlScrollOffsetX = m;
        } else {
            if (m > TeaLeaf.Client.Configuration.tlScrollOffsetX) {
                TeaLeaf.Client.Configuration.tlScrollDirection = "right";
            } else {
                if (m < TeaLeaf.Client.Configuration.tlScrollOffsetX) {
                    TeaLeaf.Client.Configuration.tlScrollDirection = "left";
                }
            }
        }
        if (TeaLeaf.Client.Configuration.tlScrollOffsetY === 0) {
            TeaLeaf.Client.Configuration.tlScrollOffsetY = i;
        } else {
            if (i > TeaLeaf.Client.Configuration.tlScrollOffsetY) {
                TeaLeaf.Client.Configuration.tlScrollDirection = "down";
            } else {
                if (i < TeaLeaf.Client.Configuration.tlScrollOffsetY) {
                    TeaLeaf.Client.Configuration.tlScrollDirection = "up";
                }
            }
        }
        if (m > 0) {
            TeaLeaf.Client.Configuration.tlScrollX = m;
        }
        if (i > 0) {
            TeaLeaf.Client.Configuration.tlScrollY = i;
        }
        if (TeaLeaf.Client.Configuration.tlScrollOffsetX === TeaLeaf.Client.Configuration.tlScrollX && TeaLeaf.Client.Configuration.tlScrollOffsetY === TeaLeaf.Client.Configuration.tlScrollY) {
            return;
        }
        if (k || (TeaLeaf.Client.Configuration.tlScrollDirectionOrig !== TeaLeaf.Client.Configuration.tlScrollDirection)) {
            j = {
                ClientX: TeaLeaf.Client.ScrollClientX,
                ClientY: TeaLeaf.Client.ScrollClientY,
                ScreenX: TeaLeaf.Client.ScrollScreenX,
                ScreenY: TeaLeaf.Client.ScrollScreenY,
                ScrollHeight: TeaLeaf.Client.ScrollHeight,
                ScrollWidth: TeaLeaf.Client.ScrollWidth,
                ScrollTop: TeaLeaf.Client.ScrollTop,
                ScrollLeft: TeaLeaf.Client.ScrollLeft,
                OrigX: TeaLeaf.Client.Configuration.tlScrollOffsetX.toString(),
                OrigY: TeaLeaf.Client.Configuration.tlScrollOffsetY.toString(),
                CurrX: TeaLeaf.Client.Configuration.tlScrollX.toString(),
                CurrY: TeaLeaf.Client.Configuration.tlScrollY.toString(),
                OrigDirection: TeaLeaf.Client.Configuration.tlScrollDirectionOrig,
                CurrDirection: TeaLeaf.Client.Configuration.tlScrollDirection
            };
            h = TeaLeaf.Event.createGuiEvent("scroll", j);
            TeaLeaf.eventQ.enqueue(h);
            TeaLeaf.tlKeepAlive();
        }
        TeaLeaf.Client.Configuration.tlScrollOffsetX = TeaLeaf.Client.Configuration.tlScrollX;
        TeaLeaf.Client.Configuration.tlScrollOffsetY = TeaLeaf.Client.Configuration.tlScrollY;
        TeaLeaf.Client.Configuration.tlScrollDirectionOrig = TeaLeaf.Client.Configuration.tlScrollDirection;
    };
    TeaLeaf.Client.tlFindAncestorByTag = function(d, e) {
        var f;
        if (!d || !e) {
            return null;
        }
        for (f = d.parentNode; f && f !== window.document; f = f.parentNode) {
            if (f.nodeType === 1 && f.tagName === e) {
                break;
            }
        }
        return f;
    };
    TeaLeaf.Client.tlCheckBlackList = function(f) {
        var g, h, e;
        if (!TeaLeaf.Client.Configuration.tlIDBlackList || !TeaLeaf.Client.Configuration.tlIDBlackList.length) {
            return false;
        }
        if (f) {
            for (g = 0; g < TeaLeaf.Client.Configuration.tlIDBlackList.length; g++) {
                e = new RegExp(TeaLeaf.Client.Configuration.tlIDBlackList[g], "g");
                h = f.match(e);
                if (h) {
                    return true;
                }
            }
        }
        return false;
    };
    TeaLeaf.Client.tlCheckWhiteList = function(f) {
        var g, h, e;
        if (!TeaLeaf.Client.Configuration.tlIDWhiteList || !TeaLeaf.Client.Configuration.tlIDWhiteList.length) {
            return true;
        }
        if (f) {
            for (g = 0; g < TeaLeaf.Client.Configuration.tlIDWhiteList.length; g++) {
                e = new RegExp(TeaLeaf.Client.Configuration.tlIDWhiteList[g], "g");
                h = f.match(e);
                if (h) {
                    return true;
                }
            }
        }
        return false;
    };
    TeaLeaf.Client.tlGetXPathFromNode = function(r) {
        var n, p, j, o = false,
            l = null,
            i = null,
            q = [],
            m = [];
        if (!r || TeaLeaf.Client.CheckIfIdValid(r)) {
            return null;
        }
        j = r;
        for (n in TeaLeaf.Client.Configuration.tlSpecialChildNodeTags) {
            if (j.tagName.toString() === n) {
                j = j.parentNode;
            }
        }
        for (o = TeaLeaf.Client.CheckIfIdValid(j); j !== window.document && !o; o = TeaLeaf.Client.CheckIfIdValid(j)) {
            l = null;
            i = null;
            switch (j.tagName) {
                case "TD":
                    i = TeaLeaf.Client.tlFindAncestorByTag(j, "TR");
                    if (i) {
                        l = i.cells;
                    }
                    break;
                case "TR":
                    i = TeaLeaf.Client.tlFindAncestorByTag(j, "TABLE");
                    if (i) {
                        l = i.rows;
                    }
                    break;
                case "OPTION":
                    i = TeaLeaf.Client.tlFindAncestorByTag(j, "SELECT");
                    if (i) {
                        l = i.options;
                    }
                    break;
                default:
                    i = j.parentNode;
                    if (!i) {
                        i = window.document;
                    }
                    l = i.childNodes;
                    break;
            }
            if (!l) {
                return null;
            }
            for (n = 0, p = 0; n < l.length; n++) {
                if (l[n].nodeType === 1 && l[n].tagName === j.tagName) {
                    if (l[n] === j) {
                        m[m.length] = [j.tagName.toUpperCase(), p];
                        break;
                    }
                    p++;
                }
            }
            j = i;
        }
        if (o) {
            m[m.length] = [j.id];
        }
        if (!m.length) {
            return null;
        }
        for (n = m.length - 1, q = []; n >= 0; n--) {
            if (m[n].length > 1) {
                q[q.length] = "['" + m[n][0] + "'," + m[n][1] + "]";
            } else {
                q[q.length] = "['" + m[n][0].toString().replace(/'/g, "\\'") + "']";
            }
        }
        return ("[" + q.join(",") + "]");
    };
    TeaLeaf.Client.CheckIfIdValid = function(e) {
        var f;
        if (!e || !e.id || typeof e.id !== "string") {
            return false;
        }
        if (TeaLeaf.Client.tlCheckBlackList(e.id) === true) {
            return false;
        }
        if (TeaLeaf.Client.tlCheckWhiteList(e.id) === false) {
            return false;
        }
        if (!TeaLeaf.Client.Configuration.tlUniqueIDCheckEnabled) {
            return true;
        }
        f = e.id;
        e.id = (new Date()).getTime() + "_TeaLeaf";
        try {
            if (!document.getElementById(f)) {
                e.id = f;
                return true;
            } else {
                e.id = f;
                return false;
            }
        } catch (d) {
            return false;
        } finally {
            e.id = f;
        }
    };
    TeaLeaf.Private.setLastProcessedEvent = function(h) {
        var g = TeaLeaf.Private,
            e = null,
            f;
        if (!h) {
            return;
        }
        if (!g.tlPrevEvent) {
            g.tlPrevEvent = {};
        }
        g.tlPrevEvent.type = h.type;
        g.tlPrevEvent.button = h.button;
        g.tlPrevEvent.clientX = h.clientX;
        g.tlPrevEvent.clientY = h.clientY;
        if (h.keyCode !== f) {
            g.tlPrevEvent.keyCode = h.keyCode;
        } else {
            g.tlPrevEvent.keyCode = e;
        }
        if (h.charCode !== f) {
            g.tlPrevEvent.charCode = h.charCode;
        } else {
            g.tlPrevEvent.charCode = e;
        }
        if (h.timeStamp !== f) {
            if (h.timeStamp.getTime) {
                g.tlPrevEvent.timeStamp = h.timeStamp.getTime();
            } else {
                g.tlPrevEvent.timeStamp = h.timeStamp;
            }
        } else {
            g.tlPrevEvent.timeStamp = new Date().getTime();
        }
        if (h.target !== f) {
            g.tlPrevEvent.target = h.target;
        } else {
            g.tlPrevEvent.target = e;
        }
        if (h.srcElement !== f) {
            g.tlPrevEvent.srcElement = h.srcElement;
        } else {
            g.tlPrevEvent.srcElement = e;
        }
    };
    TeaLeaf.Private.getLastProcessedEvent = function() {
        return TeaLeaf.Private.tlPrevEvent;
    };
    TeaLeaf.Client.isDuplicateEvent = function(f) {
        var g = TeaLeaf.Private,
            e, h = g.getLastProcessedEvent();
        if (!h || !f) {
            g.setLastProcessedEvent(f);
            return false;
        }
        if (typeof f.timeStamp !== "undefined") {
            e = f.timeStamp.getTime ? f.timeStamp.getTime() : f.timeStamp;
            if (h.timeStamp !== e) {
                g.setLastProcessedEvent(f);
                return false;
            }
        } else {
            f.timeStamp = new Date().getTime();
            if (Math.abs(f.timeStamp - h.timeStamp) > 300) {
                g.setLastProcessedEvent(f);
                return false;
            }
        }
        if (h.type !== f.type) {
            g.setLastProcessedEvent(f);
            return false;
        }
        if (h.target !== f.target) {
            g.setLastProcessedEvent(f);
            return false;
        }
        if (h.srcElement !== f.srcElement) {
            g.setLastProcessedEvent(f);
            return false;
        }
        if (h.button !== f.button) {
            g.setLastProcessedEvent(f);
            return false;
        }
        if (h.clientX !== f.clientX || h.clientY !== f.clientY) {
            g.setLastProcessedEvent(f);
            return false;
        }
        if (h.keyCode !== f.keyCode) {
            g.setLastProcessedEvent(f);
            return false;
        }
        g.setLastProcessedEvent(f);
        return true;
    };
    TeaLeaf.Client.tlCheckAttributes = function(m, n) {
        var p, i, l, k = {},
            j = TeaLeaf.Client.Configuration.tlAttributeCapture,
            o;
        for (p = 0; p < j.length; p++) {
            if (j[p].tltagname.toLowerCase() === m.tagName.toLowerCase() && j[p].tlevent === n.type.toLowerCase()) {
                i = j[p].tlattributename;
                l = m.getAttribute(i);
                if (l !== o) {
                    k[i] = l;
                }
            }
        }
        return k;
    };
    TeaLeaf.Client.tlOrientationChangeEvent = function(g) {
        var h = window.TeaLeaf,
            e, f;
        g = g || window.event;
        if (h.tlBrowserIsAndroid()) {
            f = h.Client.Configuration.tlAndroidOrientation + window.orientation;
            if (f === 270) {
                f = -90;
                h.Client.Configuration.tlAndroidOrientation = 90;
            } else {
                if (f === 360) {
                    f = 0;
                    h.Client.Configuration.tlAndroidOrientation = 0;
                } else {
                    h.Client.Configuration.tlAndroidOrientation += f;
                }
            }
        } else {
            f = window.orientation;
        }
        e = h.Event.createGuiEvent(g.type, {
            ClientSize: (window.innerWidth + "x" + window.innerHeight),
            orientation: f
        });
        h.eventQ.enqueue(e);
        h.tlKeepAlive();
    };
    TeaLeaf.Client.tlMotionEvent = function(g) {
        var h = window.TeaLeaf,
            f, e;
        g = g || window.event;
        f = {
            accelerationIncludingGravity: g.accelerationIncludingGravity
        };
        if (g.acceleration) {
            f.acceleration = g.acceleration;
        }
        if (g.interval) {
            f.interval = g.interval;
        }
        if (g.rotationRate) {
            f.rotationRate = g.rotationRate;
        }
        e = h.Event.createGuiEvent(g.type, {
            target: {
                currState: f
            }
        });
        h.eventQ.enqueue(e);
        h.tlKeepAlive();
    };
    TeaLeaf.Client.tlDeviceOrientationEvent = function(f) {
        var d = window.TeaLeaf,
            e;
        f = f || window.event;
        e = d.Event.createGuiEvent(f.type, {
            target: {
                currState: {
                    alpha: f.alpha,
                    beta: f.beta,
                    gamma: f.gamma
                }
            }
        });
        d.eventQ.enqueue(e);
        d.tlKeepAlive();
    };
    TeaLeaf.Client.tlAddTouchEvent = function(h) {
        var e = window.TeaLeaf,
            g = e.Client,
            f;
        h = h || window.event;
        if (!h.scale) {
            return;
        }
        f = {
            rotation: h.rotation ? h.rotation.toFixed(2) : 0,
            scale: h.scale ? h.scale.toFixed(2) : 1
        };
        if (typeof h.touches === "object") {
            f.touchCount = h.touches.length || 0;
        }
        g.tlAddEvent(h, f);
    };
    TeaLeaf.Client.tlAddEvent = function(I, E, L) {
        var T = window.TeaLeaf,
            G = T.Client,
            U = G.Configuration,
            M = false,
            W, X, B = 0,
            V, R, D, N = false,
            C, S, P, O, J, F, i, Q, Y, Z, K, H;
        if (!I) {
            I = window.event;
        }
        C = G.tlGetEventSource(I);
        if (!C) {
            return;
        }
        X = I.type.toLowerCase();
        if (X === "mousedown" && C.tagName === "BODY") {
            return;
        }
        S = T.getNodeType(C);
        H = G.tlGetXPathFromNode(C);
        if (!H && U.tlDiscardInvalidXPath) {
            return;
        }
        if (U.tlEnableAttr) {
            W = G.tlCheckAttributes(C, I);
        }
        G.tlSendKeys();
        G.tlSendResize();
        G.tlSendScroll(null, true);
        if (!C.TeaLeafFocusTime) {
            switch (X) {
                case "keyup":
                case "change":
                case "click":
                case "dblclick":
                case "mousedown":
                    C.TeaLeafFocusTime = new Date();
                    break;
            }
        }
        if (X === "blur" && S === "application/x-shockwave-flash") {
            return;
        }
        if (X === "click" && G.checkIsInput(C)) {
            T.Event.Configuration.tlidoflastvisitedcontrol = G.tlGetName(C);
        }
        if (X === "click" && (C.tagName.toUpperCase() === "A") && T.tlBrowserIsIE()) {
            U.tlIEhref = false;
            F = C.href;
            if (F === "#") {
                U.tlIEhref = true;
            } else {
                i = "javascript:";
                J = F.substr(0, i.length);
                if (J.toLowerCase() === i) {
                    U.tlIEhref = true;
                }
            }
        }
        Y = G.tlGetName(C);
        Z = C.id;
        if (!G.CheckIfIdValid(C)) {
            Z = "";
        }
        if (X === "blur" && C.TeaLeafFocusTime) {
            B = T.Event.tlDateDiff(new Date(), C.TeaLeafFocusTime);
            C.TeaLeafFocusTime = null;
        }
        K = null;
        Q = null;
        O = [];
        if (!G.tlIsExcluded(C)) {
            if (!C.value && X === "change" && C.tagName.toUpperCase() === "SELECT") {
                D = C.selectedIndex;
                if (D >= 0 && D < C.options.length) {
                    K = escape(C.options[D].text);
                }
            } else {
                K = G.tlReplaceValue(C);
            }
            if (K) {
                Q = T.Event.tlFormatXMLName(Y);
                if (!Q) {
                    Q = H;
                    Q = T.Event.tlFormatXMLName(Q);
                }
            }
            if (S === "checkbox" || S === "radio") {
                M = true;
                N = !!C.checked;
            }
        }
        P = {
            Name: C.name,
            Id: Z,
            ElementType: S,
            TagName: C.tagName,
            XPath: H,
            TimeInControl: B
        };
        R = P;
        if (Q && K) {
            R.ValueIn = Q;
            R[Q] = K;
        }
        if (M) {
            R.Checked = N ? "True" : "False";
        }
        V = T.Event.createGuiEvent(I.type, R);
        if (typeof L === "object") {
            V = T.extend(L, V);
        }
        if (typeof E === "object") {
            V = T.extend(E, V);
        }
        if (U.tlEnableAttr && W) {
            V = T.extend(W, V);
        }
        T.eventQ.enqueue(V);
        T.tlKeepAlive();
    };
    TeaLeaf.Client.tlQueueResize = function(b) {
        TeaLeaf.Client.tlSendKeys();
        TeaLeaf.Client.tlSendScroll(null, true);
        if (!b) {
            b = window.event;
        }
        if (b.clientX) {
            TeaLeaf.ResizeClientX = b.clientX;
            TeaLeaf.ResizeClientY = b.clientY;
            TeaLeaf.ResizeScreenX = b.screenX;
            TeaLeaf.ResizeScreenY = b.screenY;
        } else {
            TeaLeaf.ResizeClientX = b.target.width;
            TeaLeaf.ResizeClientY = b.target.height;
        }
    };
    TeaLeaf.Client.tlAttachToAllControls = function() {
        TeaLeaf.Client.Configuration.tlcontrolsattached = true;
        TeaLeaf.Client.tlAttachToControls(window);
        try {
            var d;
            for (d = 0; d < window.frames.length; d++) {
                if (window === window.frames[d]) {
                    continue;
                }
                TeaLeaf.Client.tlAttachToControls(window.frames[d]);
            }
        } catch (c) {}
    };
    TeaLeaf.Client.tlSingleAttach = function() {
        var i, func, tldomsingleelements = TeaLeaf.Client.Configuration.tlSingleAttach,
            tlelement;
        for (i = 0; i < tldomsingleelements.length; i++) {
            if (tldomsingleelements[i].domelementID) {
                tlelement = document.getElementById(tldomsingleelements[i].domelementID);
                if (tlelement) {
                    func = eval(tldomsingleelements[i].tlhandler);
                    TeaLeaf.Event.tlAddHandler(tlelement, tldomsingleelements[i].domevent, func, false);
                }
            }
        }
    };
    TeaLeaf.Client.tlAttachToControls = function(win) {
        try {
            var i, func, handlers = TeaLeaf.Client.Configuration.tlWindowHandlers;
            for (i = 0; i < handlers.length; i++) {
                if (handlers[i].load) {
                    func = eval(handlers[i].tlhandler);
                    TeaLeaf.Event.tlAddHandler(win, handlers[i].domevent, func, false);
                }
            }
            handlers = TeaLeaf.Client.Configuration.tlDocumentHandlers;
            for (i = 0; i < handlers.length; i++) {
                if (handlers[i].load) {
                    func = eval(handlers[i].tlhandler);
                    TeaLeaf.Event.tlAddHandler(win.document, handlers[i].domevent, func, false);
                }
            }
            TeaLeaf.Client.tlProcessNode(win.document.body);
        } catch (e) {}
    };
    TeaLeaf.Client.tlCheckAttach = function(control) {
        var i, handlers;
        if (control.TeaLeaf || control.TeaLeafExclude) {
            return;
        }
        control.TeaLeaf = true;
        switch (control.tagName) {
            case "INPUT":
            case "SELECT":
            case "TEXTAREA":
                TeaLeaf.Event.tlAddHandler(control, "focus", TeaLeaf.Client.tlSetFocusTime, false);
                TeaLeaf.Event.tlAddHandler(control, "blur", TeaLeaf.Client.tlHandleBlur, false);
                TeaLeaf.Event.tlAddHandler(control, "change", TeaLeaf.Client.tlAddEvent, false);
                break;
        }
        if (TeaLeaf.Client.Configuration.tlUniversalAttach) {
            handlers = TeaLeaf.Client.Configuration.tlDocumentHandlers;
            for (i = 0; i < handlers.length; i++) {
                if (handlers[i].load) {
                    TeaLeaf.Event.tlAddHandler(control, handlers[i].domevent, eval(handlers[i].tlhandler), false);
                }
            }
        }
    };
    TeaLeaf.Client.tlProcessNode = function(j, n) {
        var l, e, m, i;
        if (typeof(j) === "string") {
            j = document.getElementById(j);
        }
        if (!j) {
            j = window.document.body;
        }
        try {
            switch (j.tagName) {
                case "INPUT":
                case "SELECT":
                case "TEXTAREA":
                    TeaLeaf.Client.tlCheckAttach(j);
                    break;
                default:
                    if (TeaLeaf.Client.Configuration.tlUniversalAttach && TeaLeaf.Client.tlTagNameAllowed(j.tagName)) {
                        TeaLeaf.Client.tlCheckAttach(j);
                    }
                    break;
            }
            if (!n) {
                m = ["INPUT", "SELECT", "TEXTAREA"];
                for (l = 0; l < m.length; l++) {
                    i = j.getElementsByTagName(m[l]);
                    for (e = 0; e < i.length; e++) {
                        TeaLeaf.Client.tlCheckAttach(i[e]);
                    }
                }
                if (TeaLeaf.Client.Configuration.tlUniversalAttach) {
                    if (TeaLeaf.Client.Configuration.tlExcludeTags) {
                        i = j.getElementsByTagName("*");
                        for (l = 0; l < i.length; l++) {
                            if (TeaLeaf.Client.tlTagNameAllowed(i[l].tagName)) {
                                TeaLeaf.Client.tlCheckAttach(i[l]);
                            }
                        }
                    } else {
                        for (l in TeaLeaf.Client.Configuration.tlNodeTags) {
                            i = j.getElementsByTagName(l);
                            for (e = 0; e < i.length; e++) {
                                TeaLeaf.Client.tlCheckAttach(i[e]);
                            }
                        }
                    }
                }
            }
        } catch (k) {}
    };
    TeaLeaf.Client.tlSetFocusTime = function(f) {
        var d, e;
        if (!f) {
            f = window.event;
        }
        d = TeaLeaf.Client.tlGetEventSource(f);
        e = TeaLeaf.getNodeType(d);
        if (!d || e === "application/x-shockwave-flash") {
            return;
        }
        d = TeaLeaf.Client.tlGetEventSource(f);
        if (!d) {
            return;
        }
        if (!d.TeaLeafFocusTime) {
            d.TeaLeafFocusTime = new Date();
        }
        if (TeaLeaf.Client.Configuration.tlsendfocus) {
            TeaLeaf.Client.tlAddEvent(f);
        }
    };
    TeaLeaf.Client.tlHandleBlur = function(f) {
        var d, e;
        if (!f) {
            f = window.event;
        }
        d = TeaLeaf.Client.tlGetEventSource(f);
        e = TeaLeaf.getNodeType(d);
        if (!d || e === "application/x-shockwave-flash") {
            return;
        }
        TeaLeaf.Client.tlEndVisit(d);
        if (TeaLeaf.Client.checkIsInput(d)) {
            TeaLeaf.Event.Configuration.tlidoflastvisitedcontrol = TeaLeaf.Client.tlGetName(d);
        }
        if (TeaLeaf.Client.Configuration.tlsendblur) {
            TeaLeaf.Client.tlAddEvent(f);
        }
        d.TeaLeafFocusTime = null;
    };
    TeaLeaf.Client.tlEndVisit = function(h) {
        var g, e, f;
        if (h.TeaLeafFocusTime) {
            f = TeaLeaf.Client.tlGetName(h);
            if (!f) {
                f = TeaLeaf.Client.tlGetAnchor(h, false);
                if (f) {
                    f = "LEVEL" + f;
                } else {
                    f = "unnamed";
                }
            }
            g = TeaLeaf.Event.tlDateDiff(h.TeaLeafFocusTime, new Date());
            e = f + ":" + g;
            if (TeaLeaf.Event.Configuration.tlvisitorder) {
                TeaLeaf.Event.Configuration.tlvisitorder = TeaLeaf.Event.Configuration.tlvisitorder + ";" + e;
            } else {
                TeaLeaf.Event.Configuration.tlvisitorder = e;
            }
        }
    };
    TeaLeaf.Client.tlDetachFromAllControls = function() {
        TeaLeaf.Client.Configuration.tlcontrolsattached = false;
        TeaLeaf.Client.tlDetachFromControls(window);
        try {
            var d, e;
            for (d = 0; d < window.frames.length; d++) {
                e = window.frames[d];
                TeaLeaf.Client.tlDetachFromControls(e);
            }
        } catch (f) {}
    };
    TeaLeaf.Client.tlDetachFromControls = function(win) {
        try {
            var i, func, handlers = TeaLeaf.Client.Configuration.tlWindowHandlers,
                items;
            for (i = 0; i < handlers.length; i++) {
                func = eval(handlers[i].tlhandler);
                TeaLeaf.Event.tlRemoveHandler(win, handlers[i].domevent, func, false);
            }
            handlers = TeaLeaf.Client.Configuration.tlDocumentHandlers;
            for (i = 0; i < handlers.length; i++) {
                func = eval(handlers[i].tlhandler);
                TeaLeaf.Event.tlRemoveHandler(win.document, handlers[i].domevent, func, false);
            }
            items = win.document.getElementsByTagName("INPUT");
            for (i = 0; i < items.length; i++) {
                TeaLeaf.Event.tlRemoveHandler(items[i], "change", TeaLeaf.Client.tlAddEvent, false);
                TeaLeaf.Event.tlRemoveHandler(items[i], "blur", TeaLeaf.Client.tlHandleBlur, false);
                items[i].TeaLeaf = false;
            }
            items = win.document.getElementsByTagName("SELECT");
            for (i = 0; i < items.length; i++) {
                TeaLeaf.Event.tlRemoveHandler(items[i], "change", TeaLeaf.Client.tlAddEvent, false);
                TeaLeaf.Event.tlRemoveHandler(items[i], "blur", TeaLeaf.Client.tlHandleBlur, false);
                items[i].TeaLeaf = false;
            }
        } catch (e) {}
    };
    TeaLeaf.Client.tlAttachToControl = function(domelement, eventtype, eventHandler) {
        if (eventHandler) {
            TeaLeaf.Event.tlAddHandler(domelement, eventtype, eventHandler, false);
        } else {
            TeaLeaf.Event.tlAddHandler(domelement, eventtype, eval(TeaLeaf.Client.tlAddEvent), false);
        }
    };
    TeaLeaf.Client.tlDetachFromControl = function(domelement, eventtype, eventHandler) {
        if (eventHandler) {
            TeaLeaf.Event.tlRemoveHandler(domelement, eventtype, eventHandler, false);
        } else {
            TeaLeaf.Event.tlRemoveHandler(domelement, eventtype, eval(TeaLeaf.Client.tlAddEvent), false);
        }
    };
    TeaLeaf.Client.tlScanForAdditions = function() {
        var d, e;
        if (!TeaLeaf.Client.Configuration.tlScheduledScan) {
            return;
        }
        TeaLeaf.Client.tlProcessNode(document.body);
        try {
            for (d = 0; d < window.frames.length; d++) {
                e = window.frames[d];
                TeaLeaf.Client.tlProcessNode(e.document.body);
            }
        } catch (f) {}
        window.clearTimeout(TeaLeaf.Client.tlTimeoutID);
        TeaLeaf.Client.tlTimeoutID = window.setTimeout(TeaLeaf.Client.tlScanForAdditions, TeaLeaf.Client.Configuration.tlscanupdate);
    };
    TeaLeaf.Client.tlTagNameAllowed = function(d) {
        if (!d) {
            return false;
        }
        var c = TeaLeaf.Client.Configuration.tlNodeTags[d];
        if (!c) {
            c = false;
        }
        if (TeaLeaf.Client.Configuration.tlExcludeTags) {
            return !c;
        }
        return c;
    };
    TeaLeaf.Client.tlSetup = function() {
        var b = TeaLeaf.tlGetCookieValue("tlQueuedXML");
        if (b) {
            TeaLeaf.Event.tlQueuedXML += b.replace(/%3B/g, ";");
        }
        TeaLeaf.Client.tlAttachToAllControls();
        TeaLeaf.Client.tlSingleAttach();
        if (TeaLeaf.Event.Configuration.tlcatchpopups) {
            TeaLeaf.SavedWindowOpen = window.open;
            window.open = function(l, m, j, k) {
                var n, p = "blocked",
                    o;
                if (typeof TeaLeaf.SavedWindowOpen === "function") {
                    o = TeaLeaf.SavedWindowOpen.apply(this, arguments);
                } else {
                    l = l || "";
                    m = m || "";
                    j = j || "";
                    o = TeaLeaf.SavedWindowOpen(l, m, j, k);
                }
                try {
                    if (!o.closed) {
                        p = "visible";
                    }
                } catch (a) {}
                n = TeaLeaf.Event.createGuiEvent("WindowOpen", {
                    status: p,
                    url: escape(l),
                    name: m,
                    features: j,
                    replace: k
                });
                TeaLeaf.eventQ.enqueue(n);
                return o;
            };
        }
        window.clearTimeout(TeaLeaf.Client.tlTimeoutID);
        if (TeaLeaf.Client.Configuration.tlscanupdate > 0) {
            TeaLeaf.Client.tlTimeoutID = window.setTimeout(TeaLeaf.Client.tlScanForAdditions, TeaLeaf.Client.Configuration.tlscanupdate);
        }
    };
    TeaLeaf.Client.CallInit = function() {
        TeaLeaf.addOnLoad(TeaLeaf.Client.tlSetup);
    };
    if (!TeaLeaf.Client.Configuration.tlinit) {
        TeaLeaf.Client.Configuration.tlinit = true;
        TeaLeaf.Client.CallInit();
    }
}