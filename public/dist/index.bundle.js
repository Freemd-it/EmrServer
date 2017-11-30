/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "eb112af9eb93071ec133"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/public/dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(2)(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery JavaScript Library v3.2.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2017-03-20T18:59Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};



	function DOMEval( code, doc ) {
		doc = doc || document;

		var script = doc.createElement( "script" );

		script.text = code;
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.2.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN( obj - parseFloat( obj ) );
	},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 13
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Simple selector that can be filtered directly, removing non-Elements
	if ( risSimple.test( qualifier ) ) {
		return jQuery.filter( qualifier, elements, not );
	}

	// Complex selector, compare the two sets, removing non-Elements
	qualifier = jQuery.filter( qualifier, elements );
	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
        if ( nodeName( elem, "iframe" ) ) {
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // Treat the template element as a regular one in browsers that
        // don't support it.
        if ( nodeName( elem, "template" ) ) {
            elem = elem.content || elem;
        }

        return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( jQuery.isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ jQuery.camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ jQuery.camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( jQuery.camelCase );
			} else {
				key = jQuery.camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: jQuery.isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( ">tbody", elem )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		div.style.cssText =
			"box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	jQuery.extend( support, {
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {
			computeStyleTests();
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName( name ) {
	var ret = jQuery.cssProps[ name ];
	if ( !ret ) {
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i,
		val = 0;

	// If we already have the right measurement, avoid augmentation
	if ( extra === ( isBorderBox ? "border" : "content" ) ) {
		i = 4;

	// Otherwise initialize for horizontal or vertical properties
	} else {
		i = name === "width" ? 1 : 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with computed style
	var valueIsBorderBox,
		styles = getStyles( elem ),
		val = curCSS( elem, name, styles ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Computed unit is not pixels. Stop here and return.
	if ( rnumnonpx.test( val ) ) {
		return val;
	}

	// Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox = isBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ name ] );

	// Fall back to offsetWidth/Height when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	if ( val === "auto" ) {
		val = elem[ "offset" + name[ 0 ].toUpperCase() + name.slice( 1 ) ];
	}

	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 13
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnothtmlwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = jQuery.isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 13
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( jQuery.isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var doc, docElem, rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		rect = elem.getBoundingClientRect();

		doc = elem.ownerDocument;
		docElem = doc.documentElement;
		win = doc.defaultView;

		return {
			top: rect.top + win.pageYOffset - docElem.clientTop,
			left: rect.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset = {
				top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
				left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
			};
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( jQuery.isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( true ) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
		return jQuery;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );


/***/ }),
/* 1 */
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(3);
module.exports = __webpack_require__(14);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(4);

__webpack_require__(5);

__webpack_require__(6);

__webpack_require__(7);

__webpack_require__(8);

__webpack_require__(9);

__webpack_require__(10);

__webpack_require__(11);

__webpack_require__(12);

__webpack_require__(13);

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 5 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 6 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery');
}

+function ($) {
  'use strict';

  var version = $.fn.jquery.split(' ')[0].split('.');
  if (version[0] < 2 && version[1] < 9 || version[0] == 1 && version[1] == 9 && version[2] < 1 || version[0] > 3) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4');
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap');

    var transEndEventNames = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd otransitionend',
      transition: 'transitionend'
    };

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] };
      }
    }

    return false; // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false;
    var $el = this;
    $(this).one('bsTransitionEnd', function () {
      called = true;
    });
    var callback = function callback() {
      if (!called) $($el).trigger($.support.transition.end);
    };
    setTimeout(callback, duration);
    return this;
  };

  $(function () {
    $.support.transition = transitionEnd();

    if (!$.support.transition) return;

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function handle(e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments);
      }
    };
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.7
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]';
  var Alert = function Alert(el) {
    $(el).on('click', dismiss, this.close);
  };

  Alert.VERSION = '3.3.7';

  Alert.TRANSITION_DURATION = 150;

  Alert.prototype.close = function (e) {
    var $this = $(this);
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    var $parent = $(selector === '#' ? [] : selector);

    if (e) e.preventDefault();

    if (!$parent.length) {
      $parent = $this.closest('.alert');
    }

    $parent.trigger(e = $.Event('close.bs.alert'));

    if (e.isDefaultPrevented()) return;

    $parent.removeClass('in');

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove();
    }

    $.support.transition && $parent.hasClass('fade') ? $parent.one('bsTransitionEnd', removeElement).emulateTransitionEnd(Alert.TRANSITION_DURATION) : removeElement();
  };

  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.alert');

      if (!data) $this.data('bs.alert', data = new Alert(this));
      if (typeof option == 'string') data[option].call($this);
    });
  }

  var old = $.fn.alert;

  $.fn.alert = Plugin;
  $.fn.alert.Constructor = Alert;

  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old;
    return this;
  };

  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close);
}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.7
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function Button(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Button.DEFAULTS, options);
    this.isLoading = false;
  };

  Button.VERSION = '3.3.7';

  Button.DEFAULTS = {
    loadingText: 'loading...'
  };

  Button.prototype.setState = function (state) {
    var d = 'disabled';
    var $el = this.$element;
    var val = $el.is('input') ? 'val' : 'html';
    var data = $el.data();

    state += 'Text';

    if (data.resetText == null) $el.data('resetText', $el[val]());

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state]);

      if (state == 'loadingText') {
        this.isLoading = true;
        $el.addClass(d).attr(d, d).prop(d, true);
      } else if (this.isLoading) {
        this.isLoading = false;
        $el.removeClass(d).removeAttr(d).prop(d, false);
      }
    }, this), 0);
  };

  Button.prototype.toggle = function () {
    var changed = true;
    var $parent = this.$element.closest('[data-toggle="buttons"]');

    if ($parent.length) {
      var $input = this.$element.find('input');
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false;
        $parent.find('.active').removeClass('active');
        this.$element.addClass('active');
      } else if ($input.prop('type') == 'checkbox') {
        if ($input.prop('checked') !== this.$element.hasClass('active')) changed = false;
        this.$element.toggleClass('active');
      }
      $input.prop('checked', this.$element.hasClass('active'));
      if (changed) $input.trigger('change');
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'));
      this.$element.toggleClass('active');
    }
  };

  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.button');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.button', data = new Button(this, options));

      if (option == 'toggle') data.toggle();else if (option) data.setState(option);
    });
  }

  var old = $.fn.button;

  $.fn.button = Plugin;
  $.fn.button.Constructor = Button;

  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old;
    return this;
  };

  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    var $btn = $(e.target).closest('.btn');
    Plugin.call($btn, 'toggle');
    if (!$(e.target).is('input[type="radio"], input[type="checkbox"]')) {
      // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
      e.preventDefault();
      // The target component still receive the focus
      if ($btn.is('input,button')) $btn.trigger('focus');else $btn.find('input:visible,button:visible').first().trigger('focus');
    }
  }).on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type));
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.7
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function Carousel(element, options) {
    this.$element = $(element);
    this.$indicators = this.$element.find('.carousel-indicators');
    this.options = options;
    this.paused = null;
    this.sliding = null;
    this.interval = null;
    this.$active = null;
    this.$items = null;

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this));

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element.on('mouseenter.bs.carousel', $.proxy(this.pause, this)).on('mouseleave.bs.carousel', $.proxy(this.cycle, this));
  };

  Carousel.VERSION = '3.3.7';

  Carousel.TRANSITION_DURATION = 600;

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  };

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return;
    switch (e.which) {
      case 37:
        this.prev();break;
      case 39:
        this.next();break;
      default:
        return;
    }

    e.preventDefault();
  };

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false);

    this.interval && clearInterval(this.interval);

    this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));

    return this;
  };

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item');
    return this.$items.index(item || this.$active);
  };

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active);
    var willWrap = direction == 'prev' && activeIndex === 0 || direction == 'next' && activeIndex == this.$items.length - 1;
    if (willWrap && !this.options.wrap) return active;
    var delta = direction == 'prev' ? -1 : 1;
    var itemIndex = (activeIndex + delta) % this.$items.length;
    return this.$items.eq(itemIndex);
  };

  Carousel.prototype.to = function (pos) {
    var that = this;
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'));

    if (pos > this.$items.length - 1 || pos < 0) return;

    if (this.sliding) return this.$element.one('slid.bs.carousel', function () {
      that.to(pos);
    }); // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle();

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos));
  };

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true);

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end);
      this.cycle(true);
    }

    this.interval = clearInterval(this.interval);

    return this;
  };

  Carousel.prototype.next = function () {
    if (this.sliding) return;
    return this.slide('next');
  };

  Carousel.prototype.prev = function () {
    if (this.sliding) return;
    return this.slide('prev');
  };

  Carousel.prototype.slide = function (type, next) {
    var $active = this.$element.find('.item.active');
    var $next = next || this.getItemForDirection(type, $active);
    var isCycling = this.interval;
    var direction = type == 'next' ? 'left' : 'right';
    var that = this;

    if ($next.hasClass('active')) return this.sliding = false;

    var relatedTarget = $next[0];
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    });
    this.$element.trigger(slideEvent);
    if (slideEvent.isDefaultPrevented()) return;

    this.sliding = true;

    isCycling && this.pause();

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active');
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
      $nextIndicator && $nextIndicator.addClass('active');
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }); // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type);
      $next[0].offsetWidth; // force reflow
      $active.addClass(direction);
      $next.addClass(direction);
      $active.one('bsTransitionEnd', function () {
        $next.removeClass([type, direction].join(' ')).addClass('active');
        $active.removeClass(['active', direction].join(' '));
        that.sliding = false;
        setTimeout(function () {
          that.$element.trigger(slidEvent);
        }, 0);
      }).emulateTransitionEnd(Carousel.TRANSITION_DURATION);
    } else {
      $active.removeClass('active');
      $next.addClass('active');
      this.sliding = false;
      this.$element.trigger(slidEvent);
    }

    isCycling && this.cycle();

    return this;
  };

  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.carousel');
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);
      var action = typeof option == 'string' ? option : options.slide;

      if (!data) $this.data('bs.carousel', data = new Carousel(this, options));
      if (typeof option == 'number') data.to(option);else if (action) data[action]();else if (options.interval) data.pause().cycle();
    });
  }

  var old = $.fn.carousel;

  $.fn.carousel = Plugin;
  $.fn.carousel.Constructor = Carousel;

  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old;
    return this;
  };

  // CAROUSEL DATA-API
  // =================

  var clickHandler = function clickHandler(e) {
    var href;
    var $this = $(this);
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')); // strip for ie7
    if (!$target.hasClass('carousel')) return;
    var options = $.extend({}, $target.data(), $this.data());
    var slideIndex = $this.attr('data-slide-to');
    if (slideIndex) options.interval = false;

    Plugin.call($target, options);

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex);
    }

    e.preventDefault();
  };

  $(document).on('click.bs.carousel.data-api', '[data-slide]', clickHandler).on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler);

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this);
      Plugin.call($carousel, $carousel.data());
    });
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.7
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function Collapse(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Collapse.DEFAULTS, options);
    this.$trigger = $('[data-toggle="collapse"][href="#' + element.id + '"],' + '[data-toggle="collapse"][data-target="#' + element.id + '"]');
    this.transitioning = null;

    if (this.options.parent) {
      this.$parent = this.getParent();
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger);
    }

    if (this.options.toggle) this.toggle();
  };

  Collapse.VERSION = '3.3.7';

  Collapse.TRANSITION_DURATION = 350;

  Collapse.DEFAULTS = {
    toggle: true
  };

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width');
    return hasWidth ? 'width' : 'height';
  };

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return;

    var activesData;
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing');

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse');
      if (activesData && activesData.transitioning) return;
    }

    var startEvent = $.Event('show.bs.collapse');
    this.$element.trigger(startEvent);
    if (startEvent.isDefaultPrevented()) return;

    if (actives && actives.length) {
      Plugin.call(actives, 'hide');
      activesData || actives.data('bs.collapse', null);
    }

    var dimension = this.dimension();

    this.$element.removeClass('collapse').addClass('collapsing')[dimension](0).attr('aria-expanded', true);

    this.$trigger.removeClass('collapsed').attr('aria-expanded', true);

    this.transitioning = 1;

    var complete = function complete() {
      this.$element.removeClass('collapsing').addClass('collapse in')[dimension]('');
      this.transitioning = 0;
      this.$element.trigger('shown.bs.collapse');
    };

    if (!$.support.transition) return complete.call(this);

    var scrollSize = $.camelCase(['scroll', dimension].join('-'));

    this.$element.one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize]);
  };

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return;

    var startEvent = $.Event('hide.bs.collapse');
    this.$element.trigger(startEvent);
    if (startEvent.isDefaultPrevented()) return;

    var dimension = this.dimension();

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight;

    this.$element.addClass('collapsing').removeClass('collapse in').attr('aria-expanded', false);

    this.$trigger.addClass('collapsed').attr('aria-expanded', false);

    this.transitioning = 1;

    var complete = function complete() {
      this.transitioning = 0;
      this.$element.removeClass('collapsing').addClass('collapse').trigger('hidden.bs.collapse');
    };

    if (!$.support.transition) return complete.call(this);

    this.$element[dimension](0).one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION);
  };

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']();
  };

  Collapse.prototype.getParent = function () {
    return $(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each($.proxy(function (i, element) {
      var $element = $(element);
      this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element);
    }, this)).end();
  };

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in');

    $element.attr('aria-expanded', isOpen);
    $trigger.toggleClass('collapsed', !isOpen).attr('aria-expanded', isOpen);
  };

  function getTargetFromTrigger($trigger) {
    var href;
    var target = $trigger.attr('data-target') || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7

    return $(target);
  }

  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.collapse');
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false;
      if (!data) $this.data('bs.collapse', data = new Collapse(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.collapse;

  $.fn.collapse = Plugin;
  $.fn.collapse.Constructor = Collapse;

  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old;
    return this;
  };

  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this = $(this);

    if (!$this.attr('data-target')) e.preventDefault();

    var $target = getTargetFromTrigger($this);
    var data = $target.data('bs.collapse');
    var option = data ? 'toggle' : $this.data();

    Plugin.call($target, option);
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop';
  var toggle = '[data-toggle="dropdown"]';
  var Dropdown = function Dropdown(element) {
    $(element).on('click.bs.dropdown', this.toggle);
  };

  Dropdown.VERSION = '3.3.7';

  function getParent($this) {
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    var $parent = selector && $(selector);

    return $parent && $parent.length ? $parent : $this.parent();
  }

  function clearMenus(e) {
    if (e && e.which === 3) return;
    $(backdrop).remove();
    $(toggle).each(function () {
      var $this = $(this);
      var $parent = getParent($this);
      var relatedTarget = { relatedTarget: this };

      if (!$parent.hasClass('open')) return;

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return;

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget));

      if (e.isDefaultPrevented()) return;

      $this.attr('aria-expanded', 'false');
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget));
    });
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this);

    if ($this.is('.disabled, :disabled')) return;

    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');

    clearMenus();

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div')).addClass('dropdown-backdrop').insertAfter($(this)).on('click', clearMenus);
      }

      var relatedTarget = { relatedTarget: this };
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget));

      if (e.isDefaultPrevented()) return;

      $this.trigger('focus').attr('aria-expanded', 'true');

      $parent.toggleClass('open').trigger($.Event('shown.bs.dropdown', relatedTarget));
    }

    return false;
  };

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return;

    var $this = $(this);

    e.preventDefault();
    e.stopPropagation();

    if ($this.is('.disabled, :disabled')) return;

    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus');
      return $this.trigger('click');
    }

    var desc = ' li:not(.disabled):visible a';
    var $items = $parent.find('.dropdown-menu' + desc);

    if (!$items.length) return;

    var index = $items.index(e.target);

    if (e.which == 38 && index > 0) index--; // up
    if (e.which == 40 && index < $items.length - 1) index++; // down
    if (!~index) index = 0;

    $items.eq(index).trigger('focus');
  };

  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.dropdown');

      if (!data) $this.data('bs.dropdown', data = new Dropdown(this));
      if (typeof option == 'string') data[option].call($this);
    });
  }

  var old = $.fn.dropdown;

  $.fn.dropdown = Plugin;
  $.fn.dropdown.Constructor = Dropdown;

  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old;
    return this;
  };

  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document).on('click.bs.dropdown.data-api', clearMenus).on('click.bs.dropdown.data-api', '.dropdown form', function (e) {
    e.stopPropagation();
  }).on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown);
}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.7
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function Modal(element, options) {
    this.options = options;
    this.$body = $(document.body);
    this.$element = $(element);
    this.$dialog = this.$element.find('.modal-dialog');
    this.$backdrop = null;
    this.isShown = null;
    this.originalBodyPad = null;
    this.scrollbarWidth = 0;
    this.ignoreBackdropClick = false;

    if (this.options.remote) {
      this.$element.find('.modal-content').load(this.options.remote, $.proxy(function () {
        this.$element.trigger('loaded.bs.modal');
      }, this));
    }
  };

  Modal.VERSION = '3.3.7';

  Modal.TRANSITION_DURATION = 300;
  Modal.BACKDROP_TRANSITION_DURATION = 150;

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  };

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget);
  };

  Modal.prototype.show = function (_relatedTarget) {
    var that = this;
    var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget });

    this.$element.trigger(e);

    if (this.isShown || e.isDefaultPrevented()) return;

    this.isShown = true;

    this.checkScrollbar();
    this.setScrollbar();
    this.$body.addClass('modal-open');

    this.escape();
    this.resize();

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true;
      });
    });

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade');

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body); // don't move modals dom position
      }

      that.$element.show().scrollTop(0);

      that.adjustDialog();

      if (transition) {
        that.$element[0].offsetWidth; // force reflow
      }

      that.$element.addClass('in');

      that.enforceFocus();

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget });

      transition ? that.$dialog // wait for modal to slide in
      .one('bsTransitionEnd', function () {
        that.$element.trigger('focus').trigger(e);
      }).emulateTransitionEnd(Modal.TRANSITION_DURATION) : that.$element.trigger('focus').trigger(e);
    });
  };

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault();

    e = $.Event('hide.bs.modal');

    this.$element.trigger(e);

    if (!this.isShown || e.isDefaultPrevented()) return;

    this.isShown = false;

    this.escape();
    this.resize();

    $(document).off('focusin.bs.modal');

    this.$element.removeClass('in').off('click.dismiss.bs.modal').off('mouseup.dismiss.bs.modal');

    this.$dialog.off('mousedown.dismiss.bs.modal');

    $.support.transition && this.$element.hasClass('fade') ? this.$element.one('bsTransitionEnd', $.proxy(this.hideModal, this)).emulateTransitionEnd(Modal.TRANSITION_DURATION) : this.hideModal();
  };

  Modal.prototype.enforceFocus = function () {
    $(document).off('focusin.bs.modal') // guard against infinite focus loop
    .on('focusin.bs.modal', $.proxy(function (e) {
      if (document !== e.target && this.$element[0] !== e.target && !this.$element.has(e.target).length) {
        this.$element.trigger('focus');
      }
    }, this));
  };

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide();
      }, this));
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal');
    }
  };

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this));
    } else {
      $(window).off('resize.bs.modal');
    }
  };

  Modal.prototype.hideModal = function () {
    var that = this;
    this.$element.hide();
    this.backdrop(function () {
      that.$body.removeClass('modal-open');
      that.resetAdjustments();
      that.resetScrollbar();
      that.$element.trigger('hidden.bs.modal');
    });
  };

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove();
    this.$backdrop = null;
  };

  Modal.prototype.backdrop = function (callback) {
    var that = this;
    var animate = this.$element.hasClass('fade') ? 'fade' : '';

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate;

      this.$backdrop = $(document.createElement('div')).addClass('modal-backdrop ' + animate).appendTo(this.$body);

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false;
          return;
        }
        if (e.target !== e.currentTarget) return;
        this.options.backdrop == 'static' ? this.$element[0].focus() : this.hide();
      }, this));

      if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

      this.$backdrop.addClass('in');

      if (!callback) return;

      doAnimate ? this.$backdrop.one('bsTransitionEnd', callback).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callback();
    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in');

      var callbackRemove = function callbackRemove() {
        that.removeBackdrop();
        callback && callback();
      };
      $.support.transition && this.$element.hasClass('fade') ? this.$backdrop.one('bsTransitionEnd', callbackRemove).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callbackRemove();
    } else if (callback) {
      callback();
    }
  };

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog();
  };

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight;

    this.$element.css({
      paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    });
  };

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    });
  };

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth;
    if (!fullWindowWidth) {
      // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect();
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
    this.scrollbarWidth = this.measureScrollbar();
  };

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt(this.$body.css('padding-right') || 0, 10);
    this.originalBodyPad = document.body.style.paddingRight || '';
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth);
  };

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad);
  };

  Modal.prototype.measureScrollbar = function () {
    // thx walsh
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'modal-scrollbar-measure';
    this.$body.append(scrollDiv);
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    this.$body[0].removeChild(scrollDiv);
    return scrollbarWidth;
  };

  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.modal');
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);

      if (!data) $this.data('bs.modal', data = new Modal(this, options));
      if (typeof option == 'string') data[option](_relatedTarget);else if (options.show) data.show(_relatedTarget);
    });
  }

  var old = $.fn.modal;

  $.fn.modal = Plugin;
  $.fn.modal.Constructor = Modal;

  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old;
    return this;
  };

  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this);
    var href = $this.attr('href');
    var $target = $($this.attr('data-target') || href && href.replace(/.*(?=#[^\s]+$)/, '')); // strip for ie7
    var option = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data());

    if ($this.is('a')) e.preventDefault();

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return; // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus');
      });
    });
    Plugin.call($target, option, this);
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.7
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function Tooltip(element, options) {
    this.type = null;
    this.options = null;
    this.enabled = null;
    this.timeout = null;
    this.hoverState = null;
    this.$element = null;
    this.inState = null;

    this.init('tooltip', element, options);
  };

  Tooltip.VERSION = '3.3.7';

  Tooltip.TRANSITION_DURATION = 150;

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  };

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled = true;
    this.type = type;
    this.$element = $(element);
    this.options = this.getOptions(options);
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport);
    this.inState = { click: false, hover: false, focus: false };

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!');
    }

    var triggers = this.options.trigger.split(' ');

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i];

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this));
      } else if (trigger != 'manual') {
        var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin';
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';

        this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this));
      }
    }

    this.options.selector ? this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' }) : this.fixTitle();
  };

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS;
  };

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options);

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      };
    }

    return options;
  };

  Tooltip.prototype.getDelegateOptions = function () {
    var options = {};
    var defaults = this.getDefaults();

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value;
    });

    return options;
  };

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data('bs.' + this.type);

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data('bs.' + this.type, self);
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true;
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in';
      return;
    }

    clearTimeout(self.timeout);

    self.hoverState = 'in';

    if (!self.options.delay || !self.options.delay.show) return self.show();

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show();
    }, self.options.delay.show);
  };

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true;
    }

    return false;
  };

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data('bs.' + this.type);

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data('bs.' + this.type, self);
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false;
    }

    if (self.isInStateTrue()) return;

    clearTimeout(self.timeout);

    self.hoverState = 'out';

    if (!self.options.delay || !self.options.delay.hide) return self.hide();

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide();
    }, self.options.delay.hide);
  };

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type);

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e);

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
      if (e.isDefaultPrevented() || !inDom) return;
      var that = this;

      var $tip = this.tip();

      var tipId = this.getUID(this.type);

      this.setContent();
      $tip.attr('id', tipId);
      this.$element.attr('aria-describedby', tipId);

      if (this.options.animation) $tip.addClass('fade');

      var placement = typeof this.options.placement == 'function' ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement;

      var autoToken = /\s?auto?\s?/i;
      var autoPlace = autoToken.test(placement);
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top';

      $tip.detach().css({ top: 0, left: 0, display: 'block' }).addClass(placement).data('bs.' + this.type, this);

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);
      this.$element.trigger('inserted.bs.' + this.type);

      var pos = this.getPosition();
      var actualWidth = $tip[0].offsetWidth;
      var actualHeight = $tip[0].offsetHeight;

      if (autoPlace) {
        var orgPlacement = placement;
        var viewportDim = this.getPosition(this.$viewport);

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top' : placement == 'top' && pos.top - actualHeight < viewportDim.top ? 'bottom' : placement == 'right' && pos.right + actualWidth > viewportDim.width ? 'left' : placement == 'left' && pos.left - actualWidth < viewportDim.left ? 'right' : placement;

        $tip.removeClass(orgPlacement).addClass(placement);
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

      this.applyPlacement(calculatedOffset, placement);

      var complete = function complete() {
        var prevHoverState = that.hoverState;
        that.$element.trigger('shown.bs.' + that.type);
        that.hoverState = null;

        if (prevHoverState == 'out') that.leave(that);
      };

      $.support.transition && this.$tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();
    }
  };

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip = this.tip();
    var width = $tip[0].offsetWidth;
    var height = $tip[0].offsetHeight;

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10);
    var marginLeft = parseInt($tip.css('margin-left'), 10);

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop)) marginTop = 0;
    if (isNaN(marginLeft)) marginLeft = 0;

    offset.top += marginTop;
    offset.left += marginLeft;

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function using(props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        });
      }
    }, offset), 0);

    $tip.addClass('in');

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth = $tip[0].offsetWidth;
    var actualHeight = $tip[0].offsetHeight;

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight;
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

    if (delta.left) offset.left += delta.left;else offset.top += delta.top;

    var isVertical = /top|bottom/.test(placement);
    var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

    $tip.offset(offset);
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical);
  };

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow().css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%').css(isVertical ? 'top' : 'left', '');
  };

  Tooltip.prototype.setContent = function () {
    var $tip = this.tip();
    var title = this.getTitle();

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
    $tip.removeClass('fade in top bottom left right');
  };

  Tooltip.prototype.hide = function (callback) {
    var that = this;
    var $tip = $(this.$tip);
    var e = $.Event('hide.bs.' + this.type);

    function complete() {
      if (that.hoverState != 'in') $tip.detach();
      if (that.$element) {
        // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element.removeAttr('aria-describedby').trigger('hidden.bs.' + that.type);
      }
      callback && callback();
    }

    this.$element.trigger(e);

    if (e.isDefaultPrevented()) return;

    $tip.removeClass('in');

    $.support.transition && $tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();

    this.hoverState = null;

    return this;
  };

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element;
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '');
    }
  };

  Tooltip.prototype.hasContent = function () {
    return this.getTitle();
  };

  Tooltip.prototype.getPosition = function ($element) {
    $element = $element || this.$element;

    var el = $element[0];
    var isBody = el.tagName == 'BODY';

    var elRect = el.getBoundingClientRect();
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top });
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement;
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset = isBody ? { top: 0, left: 0 } : isSvg ? null : $element.offset();
    var scroll = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() };
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null;

    return $.extend({}, elRect, scroll, outerDims, elOffset);
  };

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 } : placement == 'top' ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } : placement == 'left' ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
    /* placement == 'right' */{ top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width };
  };

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 };
    if (!this.$viewport) return delta;

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
    var viewportDimensions = this.getPosition(this.$viewport);

    if (/right|left/.test(placement)) {
      var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
      if (topEdgeOffset < viewportDimensions.top) {
        // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset;
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) {
        // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
      }
    } else {
      var leftEdgeOffset = pos.left - viewportPadding;
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
      if (leftEdgeOffset < viewportDimensions.left) {
        // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset;
      } else if (rightEdgeOffset > viewportDimensions.right) {
        // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
      }
    }

    return delta;
  };

  Tooltip.prototype.getTitle = function () {
    var title;
    var $e = this.$element;
    var o = this.options;

    title = $e.attr('data-original-title') || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title);

    return title;
  };

  Tooltip.prototype.getUID = function (prefix) {
    do {
      prefix += ~~(Math.random() * 1000000);
    } while (document.getElementById(prefix));
    return prefix;
  };

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template);
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!');
      }
    }
    return this.$tip;
  };

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow');
  };

  Tooltip.prototype.enable = function () {
    this.enabled = true;
  };

  Tooltip.prototype.disable = function () {
    this.enabled = false;
  };

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled;
  };

  Tooltip.prototype.toggle = function (e) {
    var self = this;
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type);
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions());
        $(e.currentTarget).data('bs.' + this.type, self);
      }
    }

    if (e) {
      self.inState.click = !self.inState.click;
      if (self.isInStateTrue()) self.enter(self);else self.leave(self);
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self);
    }
  };

  Tooltip.prototype.destroy = function () {
    var that = this;
    clearTimeout(this.timeout);
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type);
      if (that.$tip) {
        that.$tip.detach();
      }
      that.$tip = null;
      that.$arrow = null;
      that.$viewport = null;
      that.$element = null;
    });
  };

  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.tooltip');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data && /destroy|hide/.test(option)) return;
      if (!data) $this.data('bs.tooltip', data = new Tooltip(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.tooltip;

  $.fn.tooltip = Plugin;
  $.fn.tooltip.Constructor = Tooltip;

  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old;
    return this;
  };
}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.7
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function Popover(element, options) {
    this.init('popover', element, options);
  };

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js');

  Popover.VERSION = '3.3.7';

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  });

  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);

  Popover.prototype.constructor = Popover;

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS;
  };

  Popover.prototype.setContent = function () {
    var $tip = this.tip();
    var title = this.getTitle();
    var content = this.getContent();

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title);
    $tip.find('.popover-content').children().detach().end()[// we use append for html objects to maintain js events
    this.options.html ? typeof content == 'string' ? 'html' : 'append' : 'text'](content);

    $tip.removeClass('fade top bottom left right in');

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide();
  };

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent();
  };

  Popover.prototype.getContent = function () {
    var $e = this.$element;
    var o = this.options;

    return $e.attr('data-content') || (typeof o.content == 'function' ? o.content.call($e[0]) : o.content);
  };

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow');
  };

  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.popover');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data && /destroy|hide/.test(option)) return;
      if (!data) $this.data('bs.popover', data = new Popover(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.popover;

  $.fn.popover = Plugin;
  $.fn.popover.Constructor = Popover;

  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old;
    return this;
  };
}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.7
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body = $(document.body);
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element);
    this.options = $.extend({}, ScrollSpy.DEFAULTS, options);
    this.selector = (this.options.target || '') + ' .nav li > a';
    this.offsets = [];
    this.targets = [];
    this.activeTarget = null;
    this.scrollHeight = 0;

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this));
    this.refresh();
    this.process();
  }

  ScrollSpy.VERSION = '3.3.7';

  ScrollSpy.DEFAULTS = {
    offset: 10
  };

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
  };

  ScrollSpy.prototype.refresh = function () {
    var that = this;
    var offsetMethod = 'offset';
    var offsetBase = 0;

    this.offsets = [];
    this.targets = [];
    this.scrollHeight = this.getScrollHeight();

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position';
      offsetBase = this.$scrollElement.scrollTop();
    }

    this.$body.find(this.selector).map(function () {
      var $el = $(this);
      var href = $el.data('target') || $el.attr('href');
      var $href = /^#./.test(href) && $(href);

      return $href && $href.length && $href.is(':visible') && [[$href[offsetMethod]().top + offsetBase, href]] || null;
    }).sort(function (a, b) {
      return a[0] - b[0];
    }).each(function () {
      that.offsets.push(this[0]);
      that.targets.push(this[1]);
    });
  };

  ScrollSpy.prototype.process = function () {
    var scrollTop = this.$scrollElement.scrollTop() + this.options.offset;
    var scrollHeight = this.getScrollHeight();
    var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height();
    var offsets = this.offsets;
    var targets = this.targets;
    var activeTarget = this.activeTarget;
    var i;

    if (this.scrollHeight != scrollHeight) {
      this.refresh();
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i);
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null;
      return this.clear();
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i] && scrollTop >= offsets[i] && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1]) && this.activate(targets[i]);
    }
  };

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target;

    this.clear();

    var selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]';

    var active = $(selector).parents('li').addClass('active');

    if (active.parent('.dropdown-menu').length) {
      active = active.closest('li.dropdown').addClass('active');
    }

    active.trigger('activate.bs.scrollspy');
  };

  ScrollSpy.prototype.clear = function () {
    $(this.selector).parentsUntil(this.options.target, '.active').removeClass('active');
  };

  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.scrollspy');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.scrollspy', data = new ScrollSpy(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.scrollspy;

  $.fn.scrollspy = Plugin;
  $.fn.scrollspy.Constructor = ScrollSpy;

  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old;
    return this;
  };

  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this);
      Plugin.call($spy, $spy.data());
    });
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.7
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function Tab(element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element);
    // jscs:enable requireDollarBeforejQueryAssignment
  };

  Tab.VERSION = '3.3.7';

  Tab.TRANSITION_DURATION = 150;

  Tab.prototype.show = function () {
    var $this = this.element;
    var $ul = $this.closest('ul:not(.dropdown-menu)');
    var selector = $this.data('target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return;

    var $previous = $ul.find('.active:last a');
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    });
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    });

    $previous.trigger(hideEvent);
    $this.trigger(showEvent);

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return;

    var $target = $(selector);

    this.activate($this.closest('li'), $ul);
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      });
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      });
    });
  };

  Tab.prototype.activate = function (element, container, callback) {
    var $active = container.find('> .active');
    var transition = callback && $.support.transition && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length);

    function next() {
      $active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded', false);

      element.addClass('active').find('[data-toggle="tab"]').attr('aria-expanded', true);

      if (transition) {
        element[0].offsetWidth; // reflow for transition
        element.addClass('in');
      } else {
        element.removeClass('fade');
      }

      if (element.parent('.dropdown-menu').length) {
        element.closest('li.dropdown').addClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded', true);
      }

      callback && callback();
    }

    $active.length && transition ? $active.one('bsTransitionEnd', next).emulateTransitionEnd(Tab.TRANSITION_DURATION) : next();

    $active.removeClass('in');
  };

  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.tab');

      if (!data) $this.data('bs.tab', data = new Tab(this));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.tab;

  $.fn.tab = Plugin;
  $.fn.tab.Constructor = Tab;

  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old;
    return this;
  };

  // TAB DATA-API
  // ============

  var clickHandler = function clickHandler(e) {
    e.preventDefault();
    Plugin.call($(this), 'show');
  };

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler).on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler);
}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.7
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function Affix(element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options);

    this.$target = $(this.options.target).on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this)).on('click.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this));

    this.$element = $(element);
    this.affixed = null;
    this.unpin = null;
    this.pinnedOffset = null;

    this.checkPosition();
  };

  Affix.VERSION = '3.3.7';

  Affix.RESET = 'affix affix-top affix-bottom';

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  };

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop = this.$target.scrollTop();
    var position = this.$element.offset();
    var targetHeight = this.$target.height();

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false;

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return scrollTop + this.unpin <= position.top ? false : 'bottom';
      return scrollTop + targetHeight <= scrollHeight - offsetBottom ? false : 'bottom';
    }

    var initializing = this.affixed == null;
    var colliderTop = initializing ? scrollTop : position.top;
    var colliderHeight = initializing ? targetHeight : height;

    if (offsetTop != null && scrollTop <= offsetTop) return 'top';
    if (offsetBottom != null && colliderTop + colliderHeight >= scrollHeight - offsetBottom) return 'bottom';

    return false;
  };

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset;
    this.$element.removeClass(Affix.RESET).addClass('affix');
    var scrollTop = this.$target.scrollTop();
    var position = this.$element.offset();
    return this.pinnedOffset = position.top - scrollTop;
  };

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1);
  };

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return;

    var height = this.$element.height();
    var offset = this.options.offset;
    var offsetTop = offset.top;
    var offsetBottom = offset.bottom;
    var scrollHeight = Math.max($(document).height(), $(document.body).height());

    if ((typeof offset === 'undefined' ? 'undefined' : _typeof(offset)) != 'object') offsetBottom = offsetTop = offset;
    if (typeof offsetTop == 'function') offsetTop = offset.top(this.$element);
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element);

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom);

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '');

      var affixType = 'affix' + (affix ? '-' + affix : '');
      var e = $.Event(affixType + '.bs.affix');

      this.$element.trigger(e);

      if (e.isDefaultPrevented()) return;

      this.affixed = affix;
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null;

      this.$element.removeClass(Affix.RESET).addClass(affixType).trigger(affixType.replace('affix', 'affixed') + '.bs.affix');
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      });
    }
  };

  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.affix');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.affix', data = new Affix(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.affix;

  $.fn.affix = Plugin;
  $.fn.affix.Constructor = Affix;

  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old;
    return this;
  };

  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this);
      var data = $spy.data();

      data.offset = data.offset || {};

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom;
      if (data.offsetTop != null) data.offset.top = data.offsetTop;

      Plugin.call($spy, data);
    });
  });
}(jQuery);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};/*
 * # Semantic UI - 2.2.11
 * https://github.com/Semantic-Org/Semantic-UI
 * http://www.semantic-ui.com/
 *
 * Copyright 2014 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 *//*!
 * # Semantic UI 2.2.11 - Site
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */;(function($,window,document,undefined){$.site=$.fn.site=function(parameters){var time=new Date().getTime(),performance=[],query=arguments[0],methodInvoked=typeof query=='string',queryArguments=[].slice.call(arguments,1),_settings=$.isPlainObject(parameters)?$.extend(true,{},$.site.settings,parameters):$.extend({},$.site.settings),namespace=_settings.namespace,error=_settings.error,eventNamespace='.'+namespace,moduleNamespace='module-'+namespace,$document=$(document),$module=$document,element=this,instance=$module.data(moduleNamespace),module,returnedValue;module={initialize:function initialize(){module.instantiate();},instantiate:function instantiate(){module.verbose('Storing instance of site',module);instance=module;$module.data(moduleNamespace,module);},normalize:function normalize(){module.fix.console();module.fix.requestAnimationFrame();},fix:{console:function(_console){function console(){return _console.apply(this,arguments);}console.toString=function(){return _console.toString();};return console;}(function(){module.debug('Normalizing window.console');if(console===undefined||console.log===undefined){module.verbose('Console not available, normalizing events');module.disable.console();}if(typeof console.group=='undefined'||typeof console.groupEnd=='undefined'||typeof console.groupCollapsed=='undefined'){module.verbose('Console group not available, normalizing events');window.console.group=function(){};window.console.groupEnd=function(){};window.console.groupCollapsed=function(){};}if(typeof console.markTimeline=='undefined'){module.verbose('Mark timeline not available, normalizing events');window.console.markTimeline=function(){};}}),consoleClear:function consoleClear(){module.debug('Disabling programmatic console clearing');window.console.clear=function(){};},requestAnimationFrame:function requestAnimationFrame(){module.debug('Normalizing requestAnimationFrame');if(window.requestAnimationFrame===undefined){module.debug('RequestAnimationFrame not available, normalizing event');window.requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||function(callback){setTimeout(callback,0);};}}},moduleExists:function moduleExists(name){return $.fn[name]!==undefined&&$.fn[name].settings!==undefined;},enabled:{modules:function modules(_modules){var enabledModules=[];_modules=_modules||_settings.modules;$.each(_modules,function(index,name){if(module.moduleExists(name)){enabledModules.push(name);}});return enabledModules;}},disabled:{modules:function modules(_modules2){var disabledModules=[];_modules2=_modules2||_settings.modules;$.each(_modules2,function(index,name){if(!module.moduleExists(name)){disabledModules.push(name);}});return disabledModules;}},change:{setting:function setting(_setting,value,modules,modifyExisting){modules=typeof modules==='string'?modules==='all'?_settings.modules:[modules]:modules||_settings.modules;modifyExisting=modifyExisting!==undefined?modifyExisting:true;$.each(modules,function(index,name){var namespace=module.moduleExists(name)?$.fn[name].settings.namespace||false:true,$existingModules;if(module.moduleExists(name)){module.verbose('Changing default setting',_setting,value,name);$.fn[name].settings[_setting]=value;if(modifyExisting&&namespace){$existingModules=$(':data(module-'+namespace+')');if($existingModules.length>0){module.verbose('Modifying existing settings',$existingModules);$existingModules[name]('setting',_setting,value);}}}});},settings:function settings(newSettings,modules,modifyExisting){modules=typeof modules==='string'?[modules]:modules||_settings.modules;modifyExisting=modifyExisting!==undefined?modifyExisting:true;$.each(modules,function(index,name){var $existingModules;if(module.moduleExists(name)){module.verbose('Changing default setting',newSettings,name);$.extend(true,$.fn[name].settings,newSettings);if(modifyExisting&&namespace){$existingModules=$(':data(module-'+namespace+')');if($existingModules.length>0){module.verbose('Modifying existing settings',$existingModules);$existingModules[name]('setting',newSettings);}}}});}},enable:{console:function console(){module.console(true);},debug:function debug(modules,modifyExisting){modules=modules||_settings.modules;module.debug('Enabling debug for modules',modules);module.change.setting('debug',true,modules,modifyExisting);},verbose:function verbose(modules,modifyExisting){modules=modules||_settings.modules;module.debug('Enabling verbose debug for modules',modules);module.change.setting('verbose',true,modules,modifyExisting);}},disable:{console:function console(){module.console(false);},debug:function debug(modules,modifyExisting){modules=modules||_settings.modules;module.debug('Disabling debug for modules',modules);module.change.setting('debug',false,modules,modifyExisting);},verbose:function verbose(modules,modifyExisting){modules=modules||_settings.modules;module.debug('Disabling verbose debug for modules',modules);module.change.setting('verbose',false,modules,modifyExisting);}},console:function console(enable){if(enable){if(instance.cache.console===undefined){module.error(error.console);return;}module.debug('Restoring console function');window.console=instance.cache.console;}else{module.debug('Disabling console function');instance.cache.console=window.console;window.console={clear:function clear(){},error:function error(){},group:function group(){},groupCollapsed:function groupCollapsed(){},groupEnd:function groupEnd(){},info:function info(){},log:function log(){},markTimeline:function markTimeline(){},warn:function warn(){}};}},destroy:function destroy(){module.verbose('Destroying previous site for',$module);$module.removeData(moduleNamespace);},cache:{},setting:function setting(name,value){if($.isPlainObject(name)){$.extend(true,_settings,name);}else if(value!==undefined){_settings[name]=value;}else{return _settings[name];}},internal:function internal(name,value){if($.isPlainObject(name)){$.extend(true,module,name);}else if(value!==undefined){module[name]=value;}else{return module[name];}},debug:function debug(){if(_settings.debug){if(_settings.performance){module.performance.log(arguments);}else{module.debug=Function.prototype.bind.call(console.info,console,_settings.name+':');module.debug.apply(console,arguments);}}},verbose:function verbose(){if(_settings.verbose&&_settings.debug){if(_settings.performance){module.performance.log(arguments);}else{module.verbose=Function.prototype.bind.call(console.info,console,_settings.name+':');module.verbose.apply(console,arguments);}}},error:function error(){module.error=Function.prototype.bind.call(console.error,console,_settings.name+':');module.error.apply(console,arguments);},performance:{log:function log(message){var currentTime,executionTime,previousTime;if(_settings.performance){currentTime=new Date().getTime();previousTime=time||currentTime;executionTime=currentTime-previousTime;time=currentTime;performance.push({'Element':element,'Name':message[0],'Arguments':[].slice.call(message,1)||'','Execution Time':executionTime});}clearTimeout(module.performance.timer);module.performance.timer=setTimeout(module.performance.display,500);},display:function display(){var title=_settings.name+':',totalTime=0;time=false;clearTimeout(module.performance.timer);$.each(performance,function(index,data){totalTime+=data['Execution Time'];});title+=' '+totalTime+'ms';if((console.group!==undefined||console.table!==undefined)&&performance.length>0){console.groupCollapsed(title);if(console.table){console.table(performance);}else{$.each(performance,function(index,data){console.log(data['Name']+': '+data['Execution Time']+'ms');});}console.groupEnd();}performance=[];}},invoke:function invoke(query,passedArguments,context){var object=instance,maxDepth,found,response;passedArguments=passedArguments||queryArguments;context=element||context;if(typeof query=='string'&&object!==undefined){query=query.split(/[\. ]/);maxDepth=query.length-1;$.each(query,function(depth,value){var camelCaseValue=depth!=maxDepth?value+query[depth+1].charAt(0).toUpperCase()+query[depth+1].slice(1):query;if($.isPlainObject(object[camelCaseValue])&&depth!=maxDepth){object=object[camelCaseValue];}else if(object[camelCaseValue]!==undefined){found=object[camelCaseValue];return false;}else if($.isPlainObject(object[value])&&depth!=maxDepth){object=object[value];}else if(object[value]!==undefined){found=object[value];return false;}else{module.error(error.method,query);return false;}});}if($.isFunction(found)){response=found.apply(context,passedArguments);}else if(found!==undefined){response=found;}if($.isArray(returnedValue)){returnedValue.push(response);}else if(returnedValue!==undefined){returnedValue=[returnedValue,response];}else if(response!==undefined){returnedValue=response;}return found;}};if(methodInvoked){if(instance===undefined){module.initialize();}module.invoke(query);}else{if(instance!==undefined){module.destroy();}module.initialize();}return returnedValue!==undefined?returnedValue:this;};$.site.settings={name:'Site',namespace:'site',error:{console:'Console cannot be restored, most likely it was overwritten outside of module',method:'The method you called is not defined.'},debug:false,verbose:false,performance:true,modules:['accordion','api','checkbox','dimmer','dropdown','embed','form','modal','nag','popup','rating','shape','sidebar','state','sticky','tab','transition','visit','visibility'],siteNamespace:'site',namespaceStub:{cache:{},config:{},sections:{},section:{},utilities:{}}};// allows for selection of elements with data attributes
$.extend($.expr[":"],{data:$.expr.createPseudo?$.expr.createPseudo(function(dataName){return function(elem){return!!$.data(elem,dataName);};}):function(elem,i,match){// support: jQuery < 1.8
return!!$.data(elem,match[3]);}});})(jQuery,window,document);/*!
 * # Semantic UI 2.2.11 - Form Validation
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */;(function($,window,document,undefined){"use strict";window=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();$.fn.form=function(parameters){var $allModules=$(this),moduleSelector=$allModules.selector||'',time=new Date().getTime(),performance=[],query=arguments[0],legacyParameters=arguments[1],methodInvoked=typeof query=='string',queryArguments=[].slice.call(arguments,1),returnedValue;$allModules.each(function(){var $module=$(this),element=this,formErrors=[],keyHeldDown=false,// set at run-time
$field,$group,$message,$prompt,$submit,$clear,$reset,_settings2,_validation,metadata,selector,className,regExp,error,namespace,moduleNamespace,eventNamespace,instance,module;module={initialize:function initialize(){// settings grabbed at run time
module.get.settings();if(methodInvoked){if(instance===undefined){module.instantiate();}module.invoke(query);}else{if(instance!==undefined){instance.invoke('destroy');}module.verbose('Initializing form validation',$module,_settings2);module.bindEvents();module.set.defaults();module.instantiate();}},instantiate:function instantiate(){module.verbose('Storing instance of module',module);instance=module;$module.data(moduleNamespace,module);},destroy:function destroy(){module.verbose('Destroying previous module',instance);module.removeEvents();$module.removeData(moduleNamespace);},refresh:function refresh(){module.verbose('Refreshing selector cache');$field=$module.find(selector.field);$group=$module.find(selector.group);$message=$module.find(selector.message);$prompt=$module.find(selector.prompt);$submit=$module.find(selector.submit);$clear=$module.find(selector.clear);$reset=$module.find(selector.reset);},submit:function submit(){module.verbose('Submitting form',$module);$module.submit();},attachEvents:function attachEvents(selector,action){action=action||'submit';$(selector).on('click'+eventNamespace,function(event){module[action]();event.preventDefault();});},bindEvents:function bindEvents(){module.verbose('Attaching form events');$module.on('submit'+eventNamespace,module.validate.form).on('blur'+eventNamespace,selector.field,module.event.field.blur).on('click'+eventNamespace,selector.submit,module.submit).on('click'+eventNamespace,selector.reset,module.reset).on('click'+eventNamespace,selector.clear,module.clear);if(_settings2.keyboardShortcuts){$module.on('keydown'+eventNamespace,selector.field,module.event.field.keydown);}$field.each(function(){var $input=$(this),type=$input.prop('type'),inputEvent=module.get.changeEvent(type,$input);$(this).on(inputEvent+eventNamespace,module.event.field.change);});},clear:function clear(){$field.each(function(){var $field=$(this),$element=$field.parent(),$fieldGroup=$field.closest($group),$prompt=$fieldGroup.find(selector.prompt),defaultValue=$field.data(metadata.defaultValue)||'',isCheckbox=$element.is(selector.uiCheckbox),isDropdown=$element.is(selector.uiDropdown),isErrored=$fieldGroup.hasClass(className.error);if(isErrored){module.verbose('Resetting error on field',$fieldGroup);$fieldGroup.removeClass(className.error);$prompt.remove();}if(isDropdown){module.verbose('Resetting dropdown value',$element,defaultValue);$element.dropdown('clear');}else if(isCheckbox){$field.prop('checked',false);}else{module.verbose('Resetting field value',$field,defaultValue);$field.val('');}});},reset:function reset(){$field.each(function(){var $field=$(this),$element=$field.parent(),$fieldGroup=$field.closest($group),$prompt=$fieldGroup.find(selector.prompt),defaultValue=$field.data(metadata.defaultValue),isCheckbox=$element.is(selector.uiCheckbox),isDropdown=$element.is(selector.uiDropdown),isErrored=$fieldGroup.hasClass(className.error);if(defaultValue===undefined){return;}if(isErrored){module.verbose('Resetting error on field',$fieldGroup);$fieldGroup.removeClass(className.error);$prompt.remove();}if(isDropdown){module.verbose('Resetting dropdown value',$element,defaultValue);$element.dropdown('restore defaults');}else if(isCheckbox){module.verbose('Resetting checkbox value',$element,defaultValue);$field.prop('checked',defaultValue);}else{module.verbose('Resetting field value',$field,defaultValue);$field.val(defaultValue);}});},determine:{isValid:function isValid(){var allValid=true;$.each(_validation,function(fieldName,field){if(!module.validate.field(field,fieldName,true)){allValid=false;}});return allValid;}},is:{bracketedRule:function bracketedRule(rule){return rule.type&&rule.type.match(_settings2.regExp.bracket);},shorthandFields:function shorthandFields(fields){var fieldKeys=Object.keys(fields),firstRule=fields[fieldKeys[0]];return module.is.shorthandRules(firstRule);},// duck type rule test
shorthandRules:function shorthandRules(rules){return typeof rules=='string'||$.isArray(rules);},empty:function empty($field){if(!$field||$field.length===0){return true;}else if($field.is('input[type="checkbox"]')){return!$field.is(':checked');}else{return module.is.blank($field);}},blank:function blank($field){return $.trim($field.val())==='';},valid:function valid(field){var allValid=true;if(field){module.verbose('Checking if field is valid',field);return module.validate.field(_validation[field],field,false);}else{module.verbose('Checking if form is valid');$.each(_validation,function(fieldName,field){if(!module.is.valid(fieldName)){allValid=false;}});return allValid;}}},removeEvents:function removeEvents(){$module.off(eventNamespace);$field.off(eventNamespace);$submit.off(eventNamespace);$field.off(eventNamespace);},event:{field:{keydown:function keydown(event){var $field=$(this),key=event.which,isInput=$field.is(selector.input),isCheckbox=$field.is(selector.checkbox),isInDropdown=$field.closest(selector.uiDropdown).length>0,keyCode={enter:13,escape:27};if(key==keyCode.escape){module.verbose('Escape key pressed blurring field');$field.blur();}if(!event.ctrlKey&&key==keyCode.enter&&isInput&&!isInDropdown&&!isCheckbox){if(!keyHeldDown){$field.one('keyup'+eventNamespace,module.event.field.keyup);module.submit();module.debug('Enter pressed on input submitting form');}keyHeldDown=true;}},keyup:function keyup(){keyHeldDown=false;},blur:function blur(event){var $field=$(this),$fieldGroup=$field.closest($group),validationRules=module.get.validation($field);if($fieldGroup.hasClass(className.error)){module.debug('Revalidating field',$field,validationRules);if(validationRules){module.validate.field(validationRules);}}else if(_settings2.on=='blur'||_settings2.on=='change'){if(validationRules){module.validate.field(validationRules);}}},change:function change(event){var $field=$(this),$fieldGroup=$field.closest($group),validationRules=module.get.validation($field);if(validationRules&&(_settings2.on=='change'||$fieldGroup.hasClass(className.error)&&_settings2.revalidate)){clearTimeout(module.timer);module.timer=setTimeout(function(){module.debug('Revalidating field',$field,module.get.validation($field));module.validate.field(validationRules);},_settings2.delay);}}}},get:{ancillaryValue:function ancillaryValue(rule){if(!rule.type||!rule.value&&!module.is.bracketedRule(rule)){return false;}return rule.value!==undefined?rule.value:rule.type.match(_settings2.regExp.bracket)[1]+'';},ruleName:function ruleName(rule){if(module.is.bracketedRule(rule)){return rule.type.replace(rule.type.match(_settings2.regExp.bracket)[0],'');}return rule.type;},changeEvent:function changeEvent(type,$input){if(type=='checkbox'||type=='radio'||type=='hidden'||$input.is('select')){return'change';}else{return module.get.inputEvent();}},inputEvent:function inputEvent(){return document.createElement('input').oninput!==undefined?'input':document.createElement('input').onpropertychange!==undefined?'propertychange':'keyup';},fieldsFromShorthand:function fieldsFromShorthand(fields){var fullFields={};$.each(fields,function(name,rules){if(typeof rules=='string'){rules=[rules];}fullFields[name]={rules:[]};$.each(rules,function(index,rule){fullFields[name].rules.push({type:rule});});});return fullFields;},prompt:function prompt(rule,field){var ruleName=module.get.ruleName(rule),ancillary=module.get.ancillaryValue(rule),prompt=rule.prompt||_settings2.prompt[ruleName]||_settings2.text.unspecifiedRule,requiresValue=prompt.search('{value}')!==-1,requiresName=prompt.search('{name}')!==-1,$label,$field,name;if(requiresName||requiresValue){$field=module.get.field(field.identifier);}if(requiresValue){prompt=prompt.replace('{value}',$field.val());}if(requiresName){$label=$field.closest(selector.group).find('label').eq(0);name=$label.length==1?$label.text():$field.prop('placeholder')||_settings2.text.unspecifiedField;prompt=prompt.replace('{name}',name);}prompt=prompt.replace('{identifier}',field.identifier);prompt=prompt.replace('{ruleValue}',ancillary);if(!rule.prompt){module.verbose('Using default validation prompt for type',prompt,ruleName);}return prompt;},settings:function settings(){if($.isPlainObject(parameters)){var keys=Object.keys(parameters),isLegacySettings=keys.length>0?parameters[keys[0]].identifier!==undefined&&parameters[keys[0]].rules!==undefined:false,ruleKeys;if(isLegacySettings){// 1.x (ducktyped)
_settings2=$.extend(true,{},$.fn.form.settings,legacyParameters);_validation=$.extend({},$.fn.form.settings.defaults,parameters);module.error(_settings2.error.oldSyntax,element);module.verbose('Extending settings from legacy parameters',_validation,_settings2);}else{// 2.x
if(parameters.fields&&module.is.shorthandFields(parameters.fields)){parameters.fields=module.get.fieldsFromShorthand(parameters.fields);}_settings2=$.extend(true,{},$.fn.form.settings,parameters);_validation=$.extend({},$.fn.form.settings.defaults,_settings2.fields);module.verbose('Extending settings',_validation,_settings2);}}else{_settings2=$.fn.form.settings;_validation=$.fn.form.settings.defaults;module.verbose('Using default form validation',_validation,_settings2);}// shorthand
namespace=_settings2.namespace;metadata=_settings2.metadata;selector=_settings2.selector;className=_settings2.className;regExp=_settings2.regExp;error=_settings2.error;moduleNamespace='module-'+namespace;eventNamespace='.'+namespace;// grab instance
instance=$module.data(moduleNamespace);// refresh selector cache
module.refresh();},field:function field(identifier){module.verbose('Finding field with identifier',identifier);identifier=module.escape.string(identifier);if($field.filter('#'+identifier).length>0){return $field.filter('#'+identifier);}else if($field.filter('[name="'+identifier+'"]').length>0){return $field.filter('[name="'+identifier+'"]');}else if($field.filter('[name="'+identifier+'[]"]').length>0){return $field.filter('[name="'+identifier+'[]"]');}else if($field.filter('[data-'+metadata.validate+'="'+identifier+'"]').length>0){return $field.filter('[data-'+metadata.validate+'="'+identifier+'"]');}return $('<input/>');},fields:function(_fields){function fields(_x){return _fields.apply(this,arguments);}fields.toString=function(){return _fields.toString();};return fields;}(function(fields){var $fields=$();$.each(fields,function(index,name){$fields=$fields.add(module.get.field(name));});return $fields;}),validation:function validation($field){var fieldValidation,identifier;if(!_validation){return false;}$.each(_validation,function(fieldName,field){identifier=field.identifier||fieldName;if(module.get.field(identifier)[0]==$field[0]){field.identifier=identifier;fieldValidation=field;}});return fieldValidation||false;},value:function value(field){var fields=[],results;fields.push(field);results=module.get.values.call(element,fields);return results[field];},values:function values(fields){var $fields=$.isArray(fields)?module.get.fields(fields):$field,values={};$fields.each(function(index,field){var $field=$(field),type=$field.prop('type'),name=$field.prop('name'),value=$field.val(),isCheckbox=$field.is(selector.checkbox),isRadio=$field.is(selector.radio),isMultiple=name.indexOf('[]')!==-1,isChecked=isCheckbox?$field.is(':checked'):false;if(name){if(isMultiple){name=name.replace('[]','');if(!values[name]){values[name]=[];}if(isCheckbox){if(isChecked){values[name].push(value||true);}else{values[name].push(false);}}else{values[name].push(value);}}else{if(isRadio){if(values[name]===undefined){values[name]=isChecked?true:false;}}else if(isCheckbox){if(isChecked){values[name]=value||true;}else{values[name]=false;}}else{values[name]=value;}}}});return values;}},has:{field:function field(identifier){module.verbose('Checking for existence of a field with identifier',identifier);identifier=module.escape.string(identifier);if(typeof identifier!=='string'){module.error(error.identifier,identifier);}if($field.filter('#'+identifier).length>0){return true;}else if($field.filter('[name="'+identifier+'"]').length>0){return true;}else if($field.filter('[data-'+metadata.validate+'="'+identifier+'"]').length>0){return true;}return false;}},escape:{string:function string(text){text=String(text);return text.replace(regExp.escape,'\\$&');}},add:{// alias
rule:function rule(name,rules){module.add.field(name,rules);},field:function field(name,rules){var newValidation={};if(module.is.shorthandRules(rules)){rules=$.isArray(rules)?rules:[rules];newValidation[name]={rules:[]};$.each(rules,function(index,rule){newValidation[name].rules.push({type:rule});});}else{newValidation[name]=rules;}_validation=$.extend({},_validation,newValidation);module.debug('Adding rules',newValidation,_validation);},fields:function(_fields2){function fields(_x2){return _fields2.apply(this,arguments);}fields.toString=function(){return _fields2.toString();};return fields;}(function(fields){var newValidation;if(fields&&module.is.shorthandFields(fields)){newValidation=module.get.fieldsFromShorthand(fields);}else{newValidation=fields;}_validation=$.extend({},_validation,newValidation);}),prompt:function prompt(identifier,errors){var $field=module.get.field(identifier),$fieldGroup=$field.closest($group),$prompt=$fieldGroup.children(selector.prompt),promptExists=$prompt.length!==0;errors=typeof errors=='string'?[errors]:errors;module.verbose('Adding field error state',identifier);$fieldGroup.addClass(className.error);if(_settings2.inline){if(!promptExists){$prompt=_settings2.templates.prompt(errors);$prompt.appendTo($fieldGroup);}$prompt.html(errors[0]);if(!promptExists){if(_settings2.transition&&$.fn.transition!==undefined&&$module.transition('is supported')){module.verbose('Displaying error with css transition',_settings2.transition);$prompt.transition(_settings2.transition+' in',_settings2.duration);}else{module.verbose('Displaying error with fallback javascript animation');$prompt.fadeIn(_settings2.duration);}}else{module.verbose('Inline errors are disabled, no inline error added',identifier);}}},errors:function errors(_errors){module.debug('Adding form error messages',_errors);module.set.error();$message.html(_settings2.templates.error(_errors));}},remove:{rule:function rule(field,_rule){var rules=$.isArray(_rule)?_rule:[_rule];if(_rule==undefined){module.debug('Removed all rules');_validation[field].rules=[];return;}if(_validation[field]==undefined||!$.isArray(_validation[field].rules)){return;}$.each(_validation[field].rules,function(index,rule){if(rules.indexOf(rule.type)!==-1){module.debug('Removed rule',rule.type);_validation[field].rules.splice(index,1);}});},field:function field(_field){var fields=$.isArray(_field)?_field:[_field];$.each(fields,function(index,field){module.remove.rule(field);});},// alias
rules:function rules(field,_rules){if($.isArray(field)){$.each(fields,function(index,field){module.remove.rule(field,_rules);});}else{module.remove.rule(field,_rules);}},fields:function(_fields3){function fields(_x3){return _fields3.apply(this,arguments);}fields.toString=function(){return _fields3.toString();};return fields;}(function(fields){module.remove.field(fields);}),prompt:function prompt(identifier){var $field=module.get.field(identifier),$fieldGroup=$field.closest($group),$prompt=$fieldGroup.children(selector.prompt);$fieldGroup.removeClass(className.error);if(_settings2.inline&&$prompt.is(':visible')){module.verbose('Removing prompt for field',identifier);if(_settings2.transition&&$.fn.transition!==undefined&&$module.transition('is supported')){$prompt.transition(_settings2.transition+' out',_settings2.duration,function(){$prompt.remove();});}else{$prompt.fadeOut(_settings2.duration,function(){$prompt.remove();});}}}},set:{success:function success(){$module.removeClass(className.error).addClass(className.success);},defaults:function defaults(){$field.each(function(){var $field=$(this),isCheckbox=$field.filter(selector.checkbox).length>0,value=isCheckbox?$field.is(':checked'):$field.val();$field.data(metadata.defaultValue,value);});},error:function error(){$module.removeClass(className.success).addClass(className.error);},value:function value(field,_value){var fields={};fields[field]=_value;return module.set.values.call(element,fields);},values:function values(fields){if($.isEmptyObject(fields)){return;}$.each(fields,function(key,value){var $field=module.get.field(key),$element=$field.parent(),isMultiple=$.isArray(value),isCheckbox=$element.is(selector.uiCheckbox),isDropdown=$element.is(selector.uiDropdown),isRadio=$field.is(selector.radio)&&isCheckbox,fieldExists=$field.length>0,$multipleField;if(fieldExists){if(isMultiple&&isCheckbox){module.verbose('Selecting multiple',value,$field);$element.checkbox('uncheck');$.each(value,function(index,value){$multipleField=$field.filter('[value="'+value+'"]');$element=$multipleField.parent();if($multipleField.length>0){$element.checkbox('check');}});}else if(isRadio){module.verbose('Selecting radio value',value,$field);$field.filter('[value="'+value+'"]').parent(selector.uiCheckbox).checkbox('check');}else if(isCheckbox){module.verbose('Setting checkbox value',value,$element);if(value===true){$element.checkbox('check');}else{$element.checkbox('uncheck');}}else if(isDropdown){module.verbose('Setting dropdown value',value,$element);$element.dropdown('set selected',value);}else{module.verbose('Setting field value',value,$field);$field.val(value);}}});}},validate:{form:function form(event,ignoreCallbacks){var values=module.get.values(),apiRequest;// input keydown event will fire submit repeatedly by browser default
if(keyHeldDown){return false;}// reset errors
formErrors=[];if(module.determine.isValid()){module.debug('Form has no validation errors, submitting');module.set.success();if(ignoreCallbacks!==true){return _settings2.onSuccess.call(element,event,values);}}else{module.debug('Form has errors');module.set.error();if(!_settings2.inline){module.add.errors(formErrors);}// prevent ajax submit
if($module.data('moduleApi')!==undefined){event.stopImmediatePropagation();}if(ignoreCallbacks!==true){return _settings2.onFailure.call(element,formErrors,values);}}},// takes a validation object and returns whether field passes validation
field:function field(_field2,fieldName,showErrors){showErrors=showErrors!==undefined?showErrors:true;if(typeof _field2=='string'){module.verbose('Validating field',_field2);fieldName=_field2;_field2=_validation[_field2];}var identifier=_field2.identifier||fieldName,$field=module.get.field(identifier),$dependsField=_field2.depends?module.get.field(_field2.depends):false,fieldValid=true,fieldErrors=[];if(!_field2.identifier){module.debug('Using field name as identifier',identifier);_field2.identifier=identifier;}if($field.prop('disabled')){module.debug('Field is disabled. Skipping',identifier);fieldValid=true;}else if(_field2.optional&&module.is.blank($field)){module.debug('Field is optional and blank. Skipping',identifier);fieldValid=true;}else if(_field2.depends&&module.is.empty($dependsField)){module.debug('Field depends on another value that is not present or empty. Skipping',$dependsField);fieldValid=true;}else if(_field2.rules!==undefined){$.each(_field2.rules,function(index,rule){if(module.has.field(identifier)&&!module.validate.rule(_field2,rule)){module.debug('Field is invalid',identifier,rule.type);fieldErrors.push(module.get.prompt(rule,_field2));fieldValid=false;}});}if(fieldValid){if(showErrors){module.remove.prompt(identifier,fieldErrors);_settings2.onValid.call($field);}}else{if(showErrors){formErrors=formErrors.concat(fieldErrors);module.add.prompt(identifier,fieldErrors);_settings2.onInvalid.call($field,fieldErrors);}return false;}return true;},// takes validation rule and returns whether field passes rule
rule:function rule(field,_rule2){var $field=module.get.field(field.identifier),type=_rule2.type,value=$field.val(),isValid=true,ancillary=module.get.ancillaryValue(_rule2),ruleName=module.get.ruleName(_rule2),ruleFunction=_settings2.rules[ruleName];if(!$.isFunction(ruleFunction)){module.error(error.noRule,ruleName);return;}// cast to string avoiding encoding special values
value=value===undefined||value===''||value===null?'':$.trim(value+'');return ruleFunction.call($field,value,ancillary);}},setting:function setting(name,value){if($.isPlainObject(name)){$.extend(true,_settings2,name);}else if(value!==undefined){_settings2[name]=value;}else{return _settings2[name];}},internal:function internal(name,value){if($.isPlainObject(name)){$.extend(true,module,name);}else if(value!==undefined){module[name]=value;}else{return module[name];}},debug:function debug(){if(!_settings2.silent&&_settings2.debug){if(_settings2.performance){module.performance.log(arguments);}else{module.debug=Function.prototype.bind.call(console.info,console,_settings2.name+':');module.debug.apply(console,arguments);}}},verbose:function verbose(){if(!_settings2.silent&&_settings2.verbose&&_settings2.debug){if(_settings2.performance){module.performance.log(arguments);}else{module.verbose=Function.prototype.bind.call(console.info,console,_settings2.name+':');module.verbose.apply(console,arguments);}}},error:function error(){if(!_settings2.silent){module.error=Function.prototype.bind.call(console.error,console,_settings2.name+':');module.error.apply(console,arguments);}},performance:{log:function log(message){var currentTime,executionTime,previousTime;if(_settings2.performance){currentTime=new Date().getTime();previousTime=time||currentTime;executionTime=currentTime-previousTime;time=currentTime;performance.push({'Name':message[0],'Arguments':[].slice.call(message,1)||'','Element':element,'Execution Time':executionTime});}clearTimeout(module.performance.timer);module.performance.timer=setTimeout(module.performance.display,500);},display:function display(){var title=_settings2.name+':',totalTime=0;time=false;clearTimeout(module.performance.timer);$.each(performance,function(index,data){totalTime+=data['Execution Time'];});title+=' '+totalTime+'ms';if(moduleSelector){title+=' \''+moduleSelector+'\'';}if($allModules.length>1){title+=' '+'('+$allModules.length+')';}if((console.group!==undefined||console.table!==undefined)&&performance.length>0){console.groupCollapsed(title);if(console.table){console.table(performance);}else{$.each(performance,function(index,data){console.log(data['Name']+': '+data['Execution Time']+'ms');});}console.groupEnd();}performance=[];}},invoke:function invoke(query,passedArguments,context){var object=instance,maxDepth,found,response;passedArguments=passedArguments||queryArguments;context=element||context;if(typeof query=='string'&&object!==undefined){query=query.split(/[\. ]/);maxDepth=query.length-1;$.each(query,function(depth,value){var camelCaseValue=depth!=maxDepth?value+query[depth+1].charAt(0).toUpperCase()+query[depth+1].slice(1):query;if($.isPlainObject(object[camelCaseValue])&&depth!=maxDepth){object=object[camelCaseValue];}else if(object[camelCaseValue]!==undefined){found=object[camelCaseValue];return false;}else if($.isPlainObject(object[value])&&depth!=maxDepth){object=object[value];}else if(object[value]!==undefined){found=object[value];return false;}else{return false;}});}if($.isFunction(found)){response=found.apply(context,passedArguments);}else if(found!==undefined){response=found;}if($.isArray(returnedValue)){returnedValue.push(response);}else if(returnedValue!==undefined){returnedValue=[returnedValue,response];}else if(response!==undefined){returnedValue=response;}return found;}};module.initialize();});return returnedValue!==undefined?returnedValue:this;};$.fn.form.settings={name:'Form',namespace:'form',debug:false,verbose:false,performance:true,fields:false,keyboardShortcuts:true,on:'submit',inline:false,delay:200,revalidate:true,transition:'scale',duration:200,onValid:function onValid(){},onInvalid:function onInvalid(){},onSuccess:function onSuccess(){return true;},onFailure:function onFailure(){return false;},metadata:{defaultValue:'default',validate:'validate'},regExp:{htmlID:/^[a-zA-Z][\w:.-]*$/g,bracket:/\[(.*)\]/i,decimal:/^\d+\.?\d*$/,email:/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,escape:/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,flags:/^\/(.*)\/(.*)?/,integer:/^\-?\d+$/,number:/^\-?\d*(\.\d+)?$/,url:/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/i},text:{unspecifiedRule:'Please enter a valid value',unspecifiedField:'This field'},prompt:{empty:'{name} must have a value',checked:'{name} must be checked',email:'{name} must be a valid e-mail',url:'{name} must be a valid url',regExp:'{name} is not formatted correctly',integer:'{name} must be an integer',decimal:'{name} must be a decimal number',number:'{name} must be set to a number',is:'{name} must be "{ruleValue}"',isExactly:'{name} must be exactly "{ruleValue}"',not:'{name} cannot be set to "{ruleValue}"',notExactly:'{name} cannot be set to exactly "{ruleValue}"',contain:'{name} cannot contain "{ruleValue}"',containExactly:'{name} cannot contain exactly "{ruleValue}"',doesntContain:'{name} must contain  "{ruleValue}"',doesntContainExactly:'{name} must contain exactly "{ruleValue}"',minLength:'{name} must be at least {ruleValue} characters',length:'{name} must be at least {ruleValue} characters',exactLength:'{name} must be exactly {ruleValue} characters',maxLength:'{name} cannot be longer than {ruleValue} characters',match:'{name} must match {ruleValue} field',different:'{name} must have a different value than {ruleValue} field',creditCard:'{name} must be a valid credit card number',minCount:'{name} must have at least {ruleValue} choices',exactCount:'{name} must have exactly {ruleValue} choices',maxCount:'{name} must have {ruleValue} or less choices'},selector:{checkbox:'input[type="checkbox"], input[type="radio"]',clear:'.clear',field:'input, textarea, select',group:'.field',input:'input',message:'.error.message',prompt:'.prompt.label',radio:'input[type="radio"]',reset:'.reset:not([type="reset"])',submit:'.submit:not([type="submit"])',uiCheckbox:'.ui.checkbox',uiDropdown:'.ui.dropdown'},className:{error:'error',label:'ui prompt label',pressed:'down',success:'success'},error:{identifier:'You must specify a string identifier for each field',method:'The method you called is not defined.',noRule:'There is no rule matching the one you specified',oldSyntax:'Starting in 2.0 forms now only take a single settings object. Validation settings converted to new syntax automatically.'},templates:{// template that produces error message
error:function error(errors){var html='<ul class="list">';$.each(errors,function(index,value){html+='<li>'+value+'</li>';});html+='</ul>';return $(html);},// template that produces label
prompt:function prompt(errors){return $('<div/>').addClass('ui basic red pointing prompt label').html(errors[0]);}},rules:{// is not empty or blank string
empty:function empty(value){return!(value===undefined||''===value||$.isArray(value)&&value.length===0);},// checkbox checked
checked:function checked(){return $(this).filter(':checked').length>0;},// is most likely an email
email:function email(value){return $.fn.form.settings.regExp.email.test(value);},// value is most likely url
url:function url(value){return $.fn.form.settings.regExp.url.test(value);},// matches specified regExp
regExp:function regExp(value,_regExp){if(_regExp instanceof RegExp){return value.match(_regExp);}var regExpParts=_regExp.match($.fn.form.settings.regExp.flags),flags;// regular expression specified as /baz/gi (flags)
if(regExpParts){_regExp=regExpParts.length>=2?regExpParts[1]:_regExp;flags=regExpParts.length>=3?regExpParts[2]:'';}return value.match(new RegExp(_regExp,flags));},// is valid integer or matches range
integer:function integer(value,range){var intRegExp=$.fn.form.settings.regExp.integer,min,max,parts;if(!range||['','..'].indexOf(range)!==-1){// do nothing
}else if(range.indexOf('..')==-1){if(intRegExp.test(range)){min=max=range-0;}}else{parts=range.split('..',2);if(intRegExp.test(parts[0])){min=parts[0]-0;}if(intRegExp.test(parts[1])){max=parts[1]-0;}}return intRegExp.test(value)&&(min===undefined||value>=min)&&(max===undefined||value<=max);},// is valid number (with decimal)
decimal:function decimal(value){return $.fn.form.settings.regExp.decimal.test(value);},// is valid number
number:function number(value){return $.fn.form.settings.regExp.number.test(value);},// is value (case insensitive)
is:function is(value,text){text=typeof text=='string'?text.toLowerCase():text;value=typeof value=='string'?value.toLowerCase():value;return value==text;},// is value
isExactly:function isExactly(value,text){return value==text;},// value is not another value (case insensitive)
not:function not(value,notValue){value=typeof value=='string'?value.toLowerCase():value;notValue=typeof notValue=='string'?notValue.toLowerCase():notValue;return value!=notValue;},// value is not another value (case sensitive)
notExactly:function notExactly(value,notValue){return value!=notValue;},// value contains text (insensitive)
contains:function contains(value,text){// escape regex characters
text=text.replace($.fn.form.settings.regExp.escape,"\\$&");return value.search(new RegExp(text,'i'))!==-1;},// value contains text (case sensitive)
containsExactly:function containsExactly(value,text){// escape regex characters
text=text.replace($.fn.form.settings.regExp.escape,"\\$&");return value.search(new RegExp(text))!==-1;},// value contains text (insensitive)
doesntContain:function doesntContain(value,text){// escape regex characters
text=text.replace($.fn.form.settings.regExp.escape,"\\$&");return value.search(new RegExp(text,'i'))===-1;},// value contains text (case sensitive)
doesntContainExactly:function doesntContainExactly(value,text){// escape regex characters
text=text.replace($.fn.form.settings.regExp.escape,"\\$&");return value.search(new RegExp(text))===-1;},// is at least string length
minLength:function minLength(value,requiredLength){return value!==undefined?value.length>=requiredLength:false;},// see rls notes for 2.0.6 (this is a duplicate of minLength)
length:function length(value,requiredLength){return value!==undefined?value.length>=requiredLength:false;},// is exactly length
exactLength:function exactLength(value,requiredLength){return value!==undefined?value.length==requiredLength:false;},// is less than length
maxLength:function maxLength(value,_maxLength){return value!==undefined?value.length<=_maxLength:false;},// matches another field
match:function match(value,identifier){var $form=$(this),matchingValue;if($('[data-validate="'+identifier+'"]').length>0){matchingValue=$('[data-validate="'+identifier+'"]').val();}else if($('#'+identifier).length>0){matchingValue=$('#'+identifier).val();}else if($('[name="'+identifier+'"]').length>0){matchingValue=$('[name="'+identifier+'"]').val();}else if($('[name="'+identifier+'[]"]').length>0){matchingValue=$('[name="'+identifier+'[]"]');}return matchingValue!==undefined?value.toString()==matchingValue.toString():false;},// different than another field
different:function different(value,identifier){// use either id or name of field
var $form=$(this),matchingValue;if($('[data-validate="'+identifier+'"]').length>0){matchingValue=$('[data-validate="'+identifier+'"]').val();}else if($('#'+identifier).length>0){matchingValue=$('#'+identifier).val();}else if($('[name="'+identifier+'"]').length>0){matchingValue=$('[name="'+identifier+'"]').val();}else if($('[name="'+identifier+'[]"]').length>0){matchingValue=$('[name="'+identifier+'[]"]');}return matchingValue!==undefined?value.toString()!==matchingValue.toString():false;},creditCard:function creditCard(cardNumber,cardTypes){var cards={visa:{pattern:/^4/,length:[16]},amex:{pattern:/^3[47]/,length:[15]},mastercard:{pattern:/^5[1-5]/,length:[16]},discover:{pattern:/^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,length:[16]},unionPay:{pattern:/^(62|88)/,length:[16,17,18,19]},jcb:{pattern:/^35(2[89]|[3-8][0-9])/,length:[16]},maestro:{pattern:/^(5018|5020|5038|6304|6759|676[1-3])/,length:[12,13,14,15,16,17,18,19]},dinersClub:{pattern:/^(30[0-5]|^36)/,length:[14]},laser:{pattern:/^(6304|670[69]|6771)/,length:[16,17,18,19]},visaElectron:{pattern:/^(4026|417500|4508|4844|491(3|7))/,length:[16]}},valid={},validCard=false,requiredTypes=typeof cardTypes=='string'?cardTypes.split(','):false,unionPay,validation;if(typeof cardNumber!=='string'||cardNumber.length===0){return;}// allow dashes in card
cardNumber=cardNumber.replace(/[\-]/g,'');// verify card types
if(requiredTypes){$.each(requiredTypes,function(index,type){// verify each card type
validation=cards[type];if(validation){valid={length:$.inArray(cardNumber.length,validation.length)!==-1,pattern:cardNumber.search(validation.pattern)!==-1};if(valid.length&&valid.pattern){validCard=true;}}});if(!validCard){return false;}}// skip luhn for UnionPay
unionPay={number:$.inArray(cardNumber.length,cards.unionPay.length)!==-1,pattern:cardNumber.search(cards.unionPay.pattern)!==-1};if(unionPay.number&&unionPay.pattern){return true;}// verify luhn, adapted from  <https://gist.github.com/2134376>
var length=cardNumber.length,multiple=0,producedValue=[[0,1,2,3,4,5,6,7,8,9],[0,2,4,6,8,1,3,5,7,9]],sum=0;while(length--){sum+=producedValue[multiple][parseInt(cardNumber.charAt(length),10)];multiple^=1;}return sum%10===0&&sum>0;},minCount:function minCount(value,_minCount){if(_minCount==0){return true;}if(_minCount==1){return value!=='';}return value.split(',').length>=_minCount;},exactCount:function exactCount(value,_exactCount){if(_exactCount==0){return value==='';}if(_exactCount==1){return value!==''&&value.search(',')===-1;}return value.split(',').length==_exactCount;},maxCount:function maxCount(value,_maxCount){if(_maxCount==0){return false;}if(_maxCount==1){return value.search(',')===-1;}return value.split(',').length<=_maxCount;}}};})(jQuery,window,document);/*!
 * # Semantic UI 2.2.11 - Accordion
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */;(function($,window,document,undefined){"use strict";window=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();$.fn.accordion=function(parameters){var $allModules=$(this),time=new Date().getTime(),performance=[],query=arguments[0],methodInvoked=typeof query=='string',queryArguments=[].slice.call(arguments,1),requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||function(callback){setTimeout(callback,0);},returnedValue;$allModules.each(function(){var settings=$.isPlainObject(parameters)?$.extend(true,{},$.fn.accordion.settings,parameters):$.extend({},$.fn.accordion.settings),className=settings.className,namespace=settings.namespace,selector=settings.selector,error=settings.error,eventNamespace='.'+namespace,moduleNamespace='module-'+namespace,moduleSelector=$allModules.selector||'',$module=$(this),$title=$module.find(selector.title),$content=$module.find(selector.content),element=this,instance=$module.data(moduleNamespace),observer,module;module={initialize:function initialize(){module.debug('Initializing',$module);module.bind.events();if(settings.observeChanges){module.observeChanges();}module.instantiate();},instantiate:function instantiate(){instance=module;$module.data(moduleNamespace,module);},destroy:function destroy(){module.debug('Destroying previous instance',$module);$module.off(eventNamespace).removeData(moduleNamespace);},refresh:function refresh(){$title=$module.find(selector.title);$content=$module.find(selector.content);},observeChanges:function observeChanges(){if('MutationObserver'in window){observer=new MutationObserver(function(mutations){module.debug('DOM tree modified, updating selector cache');module.refresh();});observer.observe(element,{childList:true,subtree:true});module.debug('Setting up mutation observer',observer);}},bind:{events:function events(){module.debug('Binding delegated events');$module.on(settings.on+eventNamespace,selector.trigger,module.event.click);}},event:{click:function click(){module.toggle.call(this);}},toggle:function toggle(query){var $activeTitle=query!==undefined?typeof query==='number'?$title.eq(query):$(query).closest(selector.title):$(this).closest(selector.title),$activeContent=$activeTitle.next($content),isAnimating=$activeContent.hasClass(className.animating),isActive=$activeContent.hasClass(className.active),isOpen=isActive&&!isAnimating,isOpening=!isActive&&isAnimating;module.debug('Toggling visibility of content',$activeTitle);if(isOpen||isOpening){if(settings.collapsible){module.close.call($activeTitle);}else{module.debug('Cannot close accordion content collapsing is disabled');}}else{module.open.call($activeTitle);}},open:function open(query){var $activeTitle=query!==undefined?typeof query==='number'?$title.eq(query):$(query).closest(selector.title):$(this).closest(selector.title),$activeContent=$activeTitle.next($content),isAnimating=$activeContent.hasClass(className.animating),isActive=$activeContent.hasClass(className.active),isOpen=isActive||isAnimating;if(isOpen){module.debug('Accordion already open, skipping',$activeContent);return;}module.debug('Opening accordion content',$activeTitle);settings.onOpening.call($activeContent);if(settings.exclusive){module.closeOthers.call($activeTitle);}$activeTitle.addClass(className.active);$activeContent.stop(true,true).addClass(className.animating);if(settings.animateChildren){if($.fn.transition!==undefined&&$module.transition('is supported')){$activeContent.children().transition({animation:'fade in',queue:false,useFailSafe:true,debug:settings.debug,verbose:settings.verbose,duration:settings.duration});}else{$activeContent.children().stop(true,true).animate({opacity:1},settings.duration,module.resetOpacity);}}$activeContent.slideDown(settings.duration,settings.easing,function(){$activeContent.removeClass(className.animating).addClass(className.active);module.reset.display.call(this);settings.onOpen.call(this);settings.onChange.call(this);});},close:function close(query){var $activeTitle=query!==undefined?typeof query==='number'?$title.eq(query):$(query).closest(selector.title):$(this).closest(selector.title),$activeContent=$activeTitle.next($content),isAnimating=$activeContent.hasClass(className.animating),isActive=$activeContent.hasClass(className.active),isOpening=!isActive&&isAnimating,isClosing=isActive&&isAnimating;if((isActive||isOpening)&&!isClosing){module.debug('Closing accordion content',$activeContent);settings.onClosing.call($activeContent);$activeTitle.removeClass(className.active);$activeContent.stop(true,true).addClass(className.animating);if(settings.animateChildren){if($.fn.transition!==undefined&&$module.transition('is supported')){$activeContent.children().transition({animation:'fade out',queue:false,useFailSafe:true,debug:settings.debug,verbose:settings.verbose,duration:settings.duration});}else{$activeContent.children().stop(true,true).animate({opacity:0},settings.duration,module.resetOpacity);}}$activeContent.slideUp(settings.duration,settings.easing,function(){$activeContent.removeClass(className.animating).removeClass(className.active);module.reset.display.call(this);settings.onClose.call(this);settings.onChange.call(this);});}},closeOthers:function closeOthers(index){var $activeTitle=index!==undefined?$title.eq(index):$(this).closest(selector.title),$parentTitles=$activeTitle.parents(selector.content).prev(selector.title),$activeAccordion=$activeTitle.closest(selector.accordion),activeSelector=selector.title+'.'+className.active+':visible',activeContent=selector.content+'.'+className.active+':visible',$openTitles,$nestedTitles,$openContents;if(settings.closeNested){$openTitles=$activeAccordion.find(activeSelector).not($parentTitles);$openContents=$openTitles.next($content);}else{$openTitles=$activeAccordion.find(activeSelector).not($parentTitles);$nestedTitles=$activeAccordion.find(activeContent).find(activeSelector).not($parentTitles);$openTitles=$openTitles.not($nestedTitles);$openContents=$openTitles.next($content);}if($openTitles.length>0){module.debug('Exclusive enabled, closing other content',$openTitles);$openTitles.removeClass(className.active);$openContents.removeClass(className.animating).stop(true,true);if(settings.animateChildren){if($.fn.transition!==undefined&&$module.transition('is supported')){$openContents.children().transition({animation:'fade out',useFailSafe:true,debug:settings.debug,verbose:settings.verbose,duration:settings.duration});}else{$openContents.children().stop(true,true).animate({opacity:0},settings.duration,module.resetOpacity);}}$openContents.slideUp(settings.duration,settings.easing,function(){$(this).removeClass(className.active);module.reset.display.call(this);});}},reset:{display:function display(){module.verbose('Removing inline display from element',this);$(this).css('display','');if($(this).attr('style')===''){$(this).attr('style','').removeAttr('style');}},opacity:function opacity(){module.verbose('Removing inline opacity from element',this);$(this).css('opacity','');if($(this).attr('style')===''){$(this).attr('style','').removeAttr('style');}}},setting:function setting(name,value){module.debug('Changing setting',name,value);if($.isPlainObject(name)){$.extend(true,settings,name);}else if(value!==undefined){if($.isPlainObject(settings[name])){$.extend(true,settings[name],value);}else{settings[name]=value;}}else{return settings[name];}},internal:function internal(name,value){module.debug('Changing internal',name,value);if(value!==undefined){if($.isPlainObject(name)){$.extend(true,module,name);}else{module[name]=value;}}else{return module[name];}},debug:function debug(){if(!settings.silent&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.debug=Function.prototype.bind.call(console.info,console,settings.name+':');module.debug.apply(console,arguments);}}},verbose:function verbose(){if(!settings.silent&&settings.verbose&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.verbose=Function.prototype.bind.call(console.info,console,settings.name+':');module.verbose.apply(console,arguments);}}},error:function error(){if(!settings.silent){module.error=Function.prototype.bind.call(console.error,console,settings.name+':');module.error.apply(console,arguments);}},performance:{log:function log(message){var currentTime,executionTime,previousTime;if(settings.performance){currentTime=new Date().getTime();previousTime=time||currentTime;executionTime=currentTime-previousTime;time=currentTime;performance.push({'Name':message[0],'Arguments':[].slice.call(message,1)||'','Element':element,'Execution Time':executionTime});}clearTimeout(module.performance.timer);module.performance.timer=setTimeout(module.performance.display,500);},display:function display(){var title=settings.name+':',totalTime=0;time=false;clearTimeout(module.performance.timer);$.each(performance,function(index,data){totalTime+=data['Execution Time'];});title+=' '+totalTime+'ms';if(moduleSelector){title+=' \''+moduleSelector+'\'';}if((console.group!==undefined||console.table!==undefined)&&performance.length>0){console.groupCollapsed(title);if(console.table){console.table(performance);}else{$.each(performance,function(index,data){console.log(data['Name']+': '+data['Execution Time']+'ms');});}console.groupEnd();}performance=[];}},invoke:function invoke(query,passedArguments,context){var object=instance,maxDepth,found,response;passedArguments=passedArguments||queryArguments;context=element||context;if(typeof query=='string'&&object!==undefined){query=query.split(/[\. ]/);maxDepth=query.length-1;$.each(query,function(depth,value){var camelCaseValue=depth!=maxDepth?value+query[depth+1].charAt(0).toUpperCase()+query[depth+1].slice(1):query;if($.isPlainObject(object[camelCaseValue])&&depth!=maxDepth){object=object[camelCaseValue];}else if(object[camelCaseValue]!==undefined){found=object[camelCaseValue];return false;}else if($.isPlainObject(object[value])&&depth!=maxDepth){object=object[value];}else if(object[value]!==undefined){found=object[value];return false;}else{module.error(error.method,query);return false;}});}if($.isFunction(found)){response=found.apply(context,passedArguments);}else if(found!==undefined){response=found;}if($.isArray(returnedValue)){returnedValue.push(response);}else if(returnedValue!==undefined){returnedValue=[returnedValue,response];}else if(response!==undefined){returnedValue=response;}return found;}};if(methodInvoked){if(instance===undefined){module.initialize();}module.invoke(query);}else{if(instance!==undefined){instance.invoke('destroy');}module.initialize();}});return returnedValue!==undefined?returnedValue:this;};$.fn.accordion.settings={name:'Accordion',namespace:'accordion',silent:false,debug:false,verbose:false,performance:true,on:'click',// event on title that opens accordion
observeChanges:true,// whether accordion should automatically refresh on DOM insertion
exclusive:true,// whether a single accordion content panel should be open at once
collapsible:true,// whether accordion content can be closed
closeNested:false,// whether nested content should be closed when a panel is closed
animateChildren:true,// whether children opacity should be animated
duration:350,// duration of animation
easing:'easeOutQuad',// easing equation for animation
onOpening:function onOpening(){},// callback before open animation
onOpen:function onOpen(){},// callback after open animation
onClosing:function onClosing(){},// callback before closing animation
onClose:function onClose(){},// callback after closing animation
onChange:function onChange(){},// callback after closing or opening animation
error:{method:'The method you called is not defined'},className:{active:'active',animating:'animating'},selector:{accordion:'.accordion',title:'.title',trigger:'.title',content:'.content'}};// Adds easing
$.extend($.easing,{easeOutQuad:function easeOutQuad(x,t,b,c,d){return-c*(t/=d)*(t-2)+b;}});})(jQuery,window,document);/*!
 * # Semantic UI 2.2.11 - Checkbox
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */;(function($,window,document,undefined){"use strict";window=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();$.fn.checkbox=function(parameters){var $allModules=$(this),moduleSelector=$allModules.selector||'',time=new Date().getTime(),performance=[],query=arguments[0],methodInvoked=typeof query=='string',queryArguments=[].slice.call(arguments,1),returnedValue;$allModules.each(function(){var settings=$.extend(true,{},$.fn.checkbox.settings,parameters),className=settings.className,namespace=settings.namespace,selector=settings.selector,error=settings.error,eventNamespace='.'+namespace,moduleNamespace='module-'+namespace,$module=$(this),$label=$(this).children(selector.label),$input=$(this).children(selector.input),input=$input[0],_initialLoad=false,shortcutPressed=false,instance=$module.data(moduleNamespace),observer,element=this,module;module={initialize:function initialize(){module.verbose('Initializing checkbox',settings);module.create.label();module.bind.events();module.set.tabbable();module.hide.input();module.observeChanges();module.instantiate();module.setup();},instantiate:function instantiate(){module.verbose('Storing instance of module',module);instance=module;$module.data(moduleNamespace,module);},destroy:function destroy(){module.verbose('Destroying module');module.unbind.events();module.show.input();$module.removeData(moduleNamespace);},fix:{reference:function reference(){if($module.is(selector.input)){module.debug('Behavior called on <input> adjusting invoked element');$module=$module.closest(selector.checkbox);module.refresh();}}},setup:function setup(){module.set.initialLoad();if(module.is.indeterminate()){module.debug('Initial value is indeterminate');module.indeterminate();}else if(module.is.checked()){module.debug('Initial value is checked');module.check();}else{module.debug('Initial value is unchecked');module.uncheck();}module.remove.initialLoad();},refresh:function refresh(){$label=$module.children(selector.label);$input=$module.children(selector.input);input=$input[0];},hide:{input:function input(){module.verbose('Modifying <input> z-index to be unselectable');$input.addClass(className.hidden);}},show:{input:function input(){module.verbose('Modifying <input> z-index to be selectable');$input.removeClass(className.hidden);}},observeChanges:function observeChanges(){if('MutationObserver'in window){observer=new MutationObserver(function(mutations){module.debug('DOM tree modified, updating selector cache');module.refresh();});observer.observe(element,{childList:true,subtree:true});module.debug('Setting up mutation observer',observer);}},attachEvents:function attachEvents(selector,event){var $element=$(selector);event=$.isFunction(module[event])?module[event]:module.toggle;if($element.length>0){module.debug('Attaching checkbox events to element',selector,event);$element.on('click'+eventNamespace,event);}else{module.error(error.notFound);}},event:{click:function click(event){var $target=$(event.target);if($target.is(selector.input)){module.verbose('Using default check action on initialized checkbox');return;}if($target.is(selector.link)){module.debug('Clicking link inside checkbox, skipping toggle');return;}module.toggle();$input.focus();event.preventDefault();},keydown:function keydown(event){var key=event.which,keyCode={enter:13,space:32,escape:27};if(key==keyCode.escape){module.verbose('Escape key pressed blurring field');$input.blur();shortcutPressed=true;}else if(!event.ctrlKey&&(key==keyCode.space||key==keyCode.enter)){module.verbose('Enter/space key pressed, toggling checkbox');module.toggle();shortcutPressed=true;}else{shortcutPressed=false;}},keyup:function keyup(event){if(shortcutPressed){event.preventDefault();}}},check:function check(){if(!module.should.allowCheck()){return;}module.debug('Checking checkbox',$input);module.set.checked();if(!module.should.ignoreCallbacks()){settings.onChecked.call(input);settings.onChange.call(input);}},uncheck:function uncheck(){if(!module.should.allowUncheck()){return;}module.debug('Unchecking checkbox');module.set.unchecked();if(!module.should.ignoreCallbacks()){settings.onUnchecked.call(input);settings.onChange.call(input);}},indeterminate:function indeterminate(){if(module.should.allowIndeterminate()){module.debug('Checkbox is already indeterminate');return;}module.debug('Making checkbox indeterminate');module.set.indeterminate();if(!module.should.ignoreCallbacks()){settings.onIndeterminate.call(input);settings.onChange.call(input);}},determinate:function determinate(){if(module.should.allowDeterminate()){module.debug('Checkbox is already determinate');return;}module.debug('Making checkbox determinate');module.set.determinate();if(!module.should.ignoreCallbacks()){settings.onDeterminate.call(input);settings.onChange.call(input);}},enable:function enable(){if(module.is.enabled()){module.debug('Checkbox is already enabled');return;}module.debug('Enabling checkbox');module.set.enabled();settings.onEnable.call(input);// preserve legacy callbacks
settings.onEnabled.call(input);},disable:function disable(){if(module.is.disabled()){module.debug('Checkbox is already disabled');return;}module.debug('Disabling checkbox');module.set.disabled();settings.onDisable.call(input);// preserve legacy callbacks
settings.onDisabled.call(input);},get:{radios:function radios(){var name=module.get.name();return $('input[name="'+name+'"]').closest(selector.checkbox);},otherRadios:function otherRadios(){return module.get.radios().not($module);},name:function name(){return $input.attr('name');}},is:{initialLoad:function initialLoad(){return _initialLoad;},radio:function radio(){return $input.hasClass(className.radio)||$input.attr('type')=='radio';},indeterminate:function indeterminate(){return $input.prop('indeterminate')!==undefined&&$input.prop('indeterminate');},checked:function checked(){return $input.prop('checked')!==undefined&&$input.prop('checked');},disabled:function disabled(){return $input.prop('disabled')!==undefined&&$input.prop('disabled');},enabled:function enabled(){return!module.is.disabled();},determinate:function determinate(){return!module.is.indeterminate();},unchecked:function unchecked(){return!module.is.checked();}},should:{allowCheck:function allowCheck(){if(module.is.determinate()&&module.is.checked()&&!module.should.forceCallbacks()){module.debug('Should not allow check, checkbox is already checked');return false;}if(settings.beforeChecked.apply(input)===false){module.debug('Should not allow check, beforeChecked cancelled');return false;}return true;},allowUncheck:function allowUncheck(){if(module.is.determinate()&&module.is.unchecked()&&!module.should.forceCallbacks()){module.debug('Should not allow uncheck, checkbox is already unchecked');return false;}if(settings.beforeUnchecked.apply(input)===false){module.debug('Should not allow uncheck, beforeUnchecked cancelled');return false;}return true;},allowIndeterminate:function allowIndeterminate(){if(module.is.indeterminate()&&!module.should.forceCallbacks()){module.debug('Should not allow indeterminate, checkbox is already indeterminate');return false;}if(settings.beforeIndeterminate.apply(input)===false){module.debug('Should not allow indeterminate, beforeIndeterminate cancelled');return false;}return true;},allowDeterminate:function allowDeterminate(){if(module.is.determinate()&&!module.should.forceCallbacks()){module.debug('Should not allow determinate, checkbox is already determinate');return false;}if(settings.beforeDeterminate.apply(input)===false){module.debug('Should not allow determinate, beforeDeterminate cancelled');return false;}return true;},forceCallbacks:function forceCallbacks(){return module.is.initialLoad()&&settings.fireOnInit;},ignoreCallbacks:function ignoreCallbacks(){return _initialLoad&&!settings.fireOnInit;}},can:{change:function change(){return!($module.hasClass(className.disabled)||$module.hasClass(className.readOnly)||$input.prop('disabled')||$input.prop('readonly'));},uncheck:function uncheck(){return typeof settings.uncheckable==='boolean'?settings.uncheckable:!module.is.radio();}},set:{initialLoad:function initialLoad(){_initialLoad=true;},checked:function checked(){module.verbose('Setting class to checked');$module.removeClass(className.indeterminate).addClass(className.checked);if(module.is.radio()){module.uncheckOthers();}if(!module.is.indeterminate()&&module.is.checked()){module.debug('Input is already checked, skipping input property change');return;}module.verbose('Setting state to checked',input);$input.prop('indeterminate',false).prop('checked',true);module.trigger.change();},unchecked:function unchecked(){module.verbose('Removing checked class');$module.removeClass(className.indeterminate).removeClass(className.checked);if(!module.is.indeterminate()&&module.is.unchecked()){module.debug('Input is already unchecked');return;}module.debug('Setting state to unchecked');$input.prop('indeterminate',false).prop('checked',false);module.trigger.change();},indeterminate:function indeterminate(){module.verbose('Setting class to indeterminate');$module.addClass(className.indeterminate);if(module.is.indeterminate()){module.debug('Input is already indeterminate, skipping input property change');return;}module.debug('Setting state to indeterminate');$input.prop('indeterminate',true);module.trigger.change();},determinate:function determinate(){module.verbose('Removing indeterminate class');$module.removeClass(className.indeterminate);if(module.is.determinate()){module.debug('Input is already determinate, skipping input property change');return;}module.debug('Setting state to determinate');$input.prop('indeterminate',false);},disabled:function disabled(){module.verbose('Setting class to disabled');$module.addClass(className.disabled);if(module.is.disabled()){module.debug('Input is already disabled, skipping input property change');return;}module.debug('Setting state to disabled');$input.prop('disabled','disabled');module.trigger.change();},enabled:function enabled(){module.verbose('Removing disabled class');$module.removeClass(className.disabled);if(module.is.enabled()){module.debug('Input is already enabled, skipping input property change');return;}module.debug('Setting state to enabled');$input.prop('disabled',false);module.trigger.change();},tabbable:function tabbable(){module.verbose('Adding tabindex to checkbox');if($input.attr('tabindex')===undefined){$input.attr('tabindex',0);}}},remove:{initialLoad:function initialLoad(){_initialLoad=false;}},trigger:{change:function change(){var events=document.createEvent('HTMLEvents'),inputElement=$input[0];if(inputElement){module.verbose('Triggering native change event');events.initEvent('change',true,false);inputElement.dispatchEvent(events);}}},create:{label:function label(){if($input.prevAll(selector.label).length>0){$input.prev(selector.label).detach().insertAfter($input);module.debug('Moving existing label',$label);}else if(!module.has.label()){$label=$('<label>').insertAfter($input);module.debug('Creating label',$label);}}},has:{label:function label(){return $label.length>0;}},bind:{events:function events(){module.verbose('Attaching checkbox events');$module.on('click'+eventNamespace,module.event.click).on('keydown'+eventNamespace,selector.input,module.event.keydown).on('keyup'+eventNamespace,selector.input,module.event.keyup);}},unbind:{events:function events(){module.debug('Removing events');$module.off(eventNamespace);}},uncheckOthers:function uncheckOthers(){var $radios=module.get.otherRadios();module.debug('Unchecking other radios',$radios);$radios.removeClass(className.checked);},toggle:function toggle(){if(!module.can.change()){if(!module.is.radio()){module.debug('Checkbox is read-only or disabled, ignoring toggle');}return;}if(module.is.indeterminate()||module.is.unchecked()){module.debug('Currently unchecked');module.check();}else if(module.is.checked()&&module.can.uncheck()){module.debug('Currently checked');module.uncheck();}},setting:function setting(name,value){module.debug('Changing setting',name,value);if($.isPlainObject(name)){$.extend(true,settings,name);}else if(value!==undefined){if($.isPlainObject(settings[name])){$.extend(true,settings[name],value);}else{settings[name]=value;}}else{return settings[name];}},internal:function internal(name,value){if($.isPlainObject(name)){$.extend(true,module,name);}else if(value!==undefined){module[name]=value;}else{return module[name];}},debug:function debug(){if(!settings.silent&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.debug=Function.prototype.bind.call(console.info,console,settings.name+':');module.debug.apply(console,arguments);}}},verbose:function verbose(){if(!settings.silent&&settings.verbose&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.verbose=Function.prototype.bind.call(console.info,console,settings.name+':');module.verbose.apply(console,arguments);}}},error:function error(){if(!settings.silent){module.error=Function.prototype.bind.call(console.error,console,settings.name+':');module.error.apply(console,arguments);}},performance:{log:function log(message){var currentTime,executionTime,previousTime;if(settings.performance){currentTime=new Date().getTime();previousTime=time||currentTime;executionTime=currentTime-previousTime;time=currentTime;performance.push({'Name':message[0],'Arguments':[].slice.call(message,1)||'','Element':element,'Execution Time':executionTime});}clearTimeout(module.performance.timer);module.performance.timer=setTimeout(module.performance.display,500);},display:function display(){var title=settings.name+':',totalTime=0;time=false;clearTimeout(module.performance.timer);$.each(performance,function(index,data){totalTime+=data['Execution Time'];});title+=' '+totalTime+'ms';if(moduleSelector){title+=' \''+moduleSelector+'\'';}if((console.group!==undefined||console.table!==undefined)&&performance.length>0){console.groupCollapsed(title);if(console.table){console.table(performance);}else{$.each(performance,function(index,data){console.log(data['Name']+': '+data['Execution Time']+'ms');});}console.groupEnd();}performance=[];}},invoke:function invoke(query,passedArguments,context){var object=instance,maxDepth,found,response;passedArguments=passedArguments||queryArguments;context=element||context;if(typeof query=='string'&&object!==undefined){query=query.split(/[\. ]/);maxDepth=query.length-1;$.each(query,function(depth,value){var camelCaseValue=depth!=maxDepth?value+query[depth+1].charAt(0).toUpperCase()+query[depth+1].slice(1):query;if($.isPlainObject(object[camelCaseValue])&&depth!=maxDepth){object=object[camelCaseValue];}else if(object[camelCaseValue]!==undefined){found=object[camelCaseValue];return false;}else if($.isPlainObject(object[value])&&depth!=maxDepth){object=object[value];}else if(object[value]!==undefined){found=object[value];return false;}else{module.error(error.method,query);return false;}});}if($.isFunction(found)){response=found.apply(context,passedArguments);}else if(found!==undefined){response=found;}if($.isArray(returnedValue)){returnedValue.push(response);}else if(returnedValue!==undefined){returnedValue=[returnedValue,response];}else if(response!==undefined){returnedValue=response;}return found;}};if(methodInvoked){if(instance===undefined){module.initialize();}module.invoke(query);}else{if(instance!==undefined){instance.invoke('destroy');}module.initialize();}});return returnedValue!==undefined?returnedValue:this;};$.fn.checkbox.settings={name:'Checkbox',namespace:'checkbox',silent:false,debug:false,verbose:true,performance:true,// delegated event context
uncheckable:'auto',fireOnInit:false,onChange:function onChange(){},beforeChecked:function beforeChecked(){},beforeUnchecked:function beforeUnchecked(){},beforeDeterminate:function beforeDeterminate(){},beforeIndeterminate:function beforeIndeterminate(){},onChecked:function onChecked(){},onUnchecked:function onUnchecked(){},onDeterminate:function onDeterminate(){},onIndeterminate:function onIndeterminate(){},onEnable:function onEnable(){},onDisable:function onDisable(){},// preserve misspelled callbacks (will be removed in 3.0)
onEnabled:function onEnabled(){},onDisabled:function onDisabled(){},className:{checked:'checked',indeterminate:'indeterminate',disabled:'disabled',hidden:'hidden',radio:'radio',readOnly:'read-only'},error:{method:'The method you called is not defined'},selector:{checkbox:'.ui.checkbox',label:'label, .box',input:'input[type="checkbox"], input[type="radio"]',link:'a[href]'}};})(jQuery,window,document);/*!
 * # Semantic UI 2.2.11 - Dimmer
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */;(function($,window,document,undefined){"use strict";window=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();$.fn.dimmer=function(parameters){var $allModules=$(this),time=new Date().getTime(),performance=[],query=arguments[0],methodInvoked=typeof query=='string',queryArguments=[].slice.call(arguments,1),returnedValue;$allModules.each(function(){var settings=$.isPlainObject(parameters)?$.extend(true,{},$.fn.dimmer.settings,parameters):$.extend({},$.fn.dimmer.settings),selector=settings.selector,namespace=settings.namespace,className=settings.className,error=settings.error,eventNamespace='.'+namespace,moduleNamespace='module-'+namespace,moduleSelector=$allModules.selector||'',clickEvent='ontouchstart'in document.documentElement?'touchstart':'click',$module=$(this),$dimmer,$dimmable,element=this,instance=$module.data(moduleNamespace),module;module={preinitialize:function preinitialize(){if(module.is.dimmer()){$dimmable=$module.parent();$dimmer=$module;}else{$dimmable=$module;if(module.has.dimmer()){if(settings.dimmerName){$dimmer=$dimmable.find(selector.dimmer).filter('.'+settings.dimmerName);}else{$dimmer=$dimmable.find(selector.dimmer);}}else{$dimmer=module.create();}module.set.variation();}},initialize:function initialize(){module.debug('Initializing dimmer',settings);module.bind.events();module.set.dimmable();module.instantiate();},instantiate:function instantiate(){module.verbose('Storing instance of module',module);instance=module;$module.data(moduleNamespace,instance);},destroy:function destroy(){module.verbose('Destroying previous module',$dimmer);module.unbind.events();module.remove.variation();$dimmable.off(eventNamespace);},bind:{events:function events(){if(settings.on=='hover'){$dimmable.on('mouseenter'+eventNamespace,module.show).on('mouseleave'+eventNamespace,module.hide);}else if(settings.on=='click'){$dimmable.on(clickEvent+eventNamespace,module.toggle);}if(module.is.page()){module.debug('Setting as a page dimmer',$dimmable);module.set.pageDimmer();}if(module.is.closable()){module.verbose('Adding dimmer close event',$dimmer);$dimmable.on(clickEvent+eventNamespace,selector.dimmer,module.event.click);}}},unbind:{events:function events(){$module.removeData(moduleNamespace);$dimmable.off(eventNamespace);}},event:{click:function click(event){module.verbose('Determining if event occured on dimmer',event);if($dimmer.find(event.target).length===0||$(event.target).is(selector.content)){module.hide();event.stopImmediatePropagation();}}},addContent:function addContent(element){var $content=$(element);module.debug('Add content to dimmer',$content);if($content.parent()[0]!==$dimmer[0]){$content.detach().appendTo($dimmer);}},create:function create(){var $element=$(settings.template.dimmer());if(settings.dimmerName){module.debug('Creating named dimmer',settings.dimmerName);$element.addClass(settings.dimmerName);}$element.appendTo($dimmable);return $element;},show:function show(callback){callback=$.isFunction(callback)?callback:function(){};module.debug('Showing dimmer',$dimmer,settings);if((!module.is.dimmed()||module.is.animating())&&module.is.enabled()){module.animate.show(callback);settings.onShow.call(element);settings.onChange.call(element);}else{module.debug('Dimmer is already shown or disabled');}},hide:function hide(callback){callback=$.isFunction(callback)?callback:function(){};if(module.is.dimmed()||module.is.animating()){module.debug('Hiding dimmer',$dimmer);module.animate.hide(callback);settings.onHide.call(element);settings.onChange.call(element);}else{module.debug('Dimmer is not visible');}},toggle:function toggle(){module.verbose('Toggling dimmer visibility',$dimmer);if(!module.is.dimmed()){module.show();}else{module.hide();}},animate:{show:function show(callback){callback=$.isFunction(callback)?callback:function(){};if(settings.useCSS&&$.fn.transition!==undefined&&$dimmer.transition('is supported')){if(settings.opacity!=='auto'){module.set.opacity();}$dimmer.transition({animation:settings.transition+' in',queue:false,duration:module.get.duration(),useFailSafe:true,onStart:function onStart(){module.set.dimmed();},onComplete:function onComplete(){module.set.active();callback();}});}else{module.verbose('Showing dimmer animation with javascript');module.set.dimmed();if(settings.opacity=='auto'){settings.opacity=0.8;}$dimmer.stop().css({opacity:0,width:'100%',height:'100%'}).fadeTo(module.get.duration(),settings.opacity,function(){$dimmer.removeAttr('style');module.set.active();callback();});}},hide:function hide(callback){callback=$.isFunction(callback)?callback:function(){};if(settings.useCSS&&$.fn.transition!==undefined&&$dimmer.transition('is supported')){module.verbose('Hiding dimmer with css');$dimmer.transition({animation:settings.transition+' out',queue:false,duration:module.get.duration(),useFailSafe:true,onStart:function onStart(){module.remove.dimmed();},onComplete:function onComplete(){module.remove.active();callback();}});}else{module.verbose('Hiding dimmer with javascript');module.remove.dimmed();$dimmer.stop().fadeOut(module.get.duration(),function(){module.remove.active();$dimmer.removeAttr('style');callback();});}}},get:{dimmer:function dimmer(){return $dimmer;},duration:function duration(){if(_typeof(settings.duration)=='object'){if(module.is.active()){return settings.duration.hide;}else{return settings.duration.show;}}return settings.duration;}},has:{dimmer:function dimmer(){if(settings.dimmerName){return $module.find(selector.dimmer).filter('.'+settings.dimmerName).length>0;}else{return $module.find(selector.dimmer).length>0;}}},is:{active:function active(){return $dimmer.hasClass(className.active);},animating:function animating(){return $dimmer.is(':animated')||$dimmer.hasClass(className.animating);},closable:function closable(){if(settings.closable=='auto'){if(settings.on=='hover'){return false;}return true;}return settings.closable;},dimmer:function dimmer(){return $module.hasClass(className.dimmer);},dimmable:function dimmable(){return $module.hasClass(className.dimmable);},dimmed:function dimmed(){return $dimmable.hasClass(className.dimmed);},disabled:function disabled(){return $dimmable.hasClass(className.disabled);},enabled:function enabled(){return!module.is.disabled();},page:function page(){return $dimmable.is('body');},pageDimmer:function pageDimmer(){return $dimmer.hasClass(className.pageDimmer);}},can:{show:function show(){return!$dimmer.hasClass(className.disabled);}},set:{opacity:function opacity(_opacity){var color=$dimmer.css('background-color'),colorArray=color.split(','),isRGB=colorArray&&colorArray.length==3,isRGBA=colorArray&&colorArray.length==4;_opacity=settings.opacity===0?0:settings.opacity||_opacity;if(isRGB||isRGBA){colorArray[3]=_opacity+')';color=colorArray.join(',');}else{color='rgba(0, 0, 0, '+_opacity+')';}module.debug('Setting opacity to',_opacity);$dimmer.css('background-color',color);},active:function active(){$dimmer.addClass(className.active);},dimmable:function dimmable(){$dimmable.addClass(className.dimmable);},dimmed:function dimmed(){$dimmable.addClass(className.dimmed);},pageDimmer:function pageDimmer(){$dimmer.addClass(className.pageDimmer);},disabled:function disabled(){$dimmer.addClass(className.disabled);},variation:function variation(_variation){_variation=_variation||settings.variation;if(_variation){$dimmer.addClass(_variation);}}},remove:{active:function active(){$dimmer.removeClass(className.active);},dimmed:function dimmed(){$dimmable.removeClass(className.dimmed);},disabled:function disabled(){$dimmer.removeClass(className.disabled);},variation:function variation(_variation2){_variation2=_variation2||settings.variation;if(_variation2){$dimmer.removeClass(_variation2);}}},setting:function setting(name,value){module.debug('Changing setting',name,value);if($.isPlainObject(name)){$.extend(true,settings,name);}else if(value!==undefined){if($.isPlainObject(settings[name])){$.extend(true,settings[name],value);}else{settings[name]=value;}}else{return settings[name];}},internal:function internal(name,value){if($.isPlainObject(name)){$.extend(true,module,name);}else if(value!==undefined){module[name]=value;}else{return module[name];}},debug:function debug(){if(!settings.silent&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.debug=Function.prototype.bind.call(console.info,console,settings.name+':');module.debug.apply(console,arguments);}}},verbose:function verbose(){if(!settings.silent&&settings.verbose&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.verbose=Function.prototype.bind.call(console.info,console,settings.name+':');module.verbose.apply(console,arguments);}}},error:function error(){if(!settings.silent){module.error=Function.prototype.bind.call(console.error,console,settings.name+':');module.error.apply(console,arguments);}},performance:{log:function log(message){var currentTime,executionTime,previousTime;if(settings.performance){currentTime=new Date().getTime();previousTime=time||currentTime;executionTime=currentTime-previousTime;time=currentTime;performance.push({'Name':message[0],'Arguments':[].slice.call(message,1)||'','Element':element,'Execution Time':executionTime});}clearTimeout(module.performance.timer);module.performance.timer=setTimeout(module.performance.display,500);},display:function display(){var title=settings.name+':',totalTime=0;time=false;clearTimeout(module.performance.timer);$.each(performance,function(index,data){totalTime+=data['Execution Time'];});title+=' '+totalTime+'ms';if(moduleSelector){title+=' \''+moduleSelector+'\'';}if($allModules.length>1){title+=' '+'('+$allModules.length+')';}if((console.group!==undefined||console.table!==undefined)&&performance.length>0){console.groupCollapsed(title);if(console.table){console.table(performance);}else{$.each(performance,function(index,data){console.log(data['Name']+': '+data['Execution Time']+'ms');});}console.groupEnd();}performance=[];}},invoke:function invoke(query,passedArguments,context){var object=instance,maxDepth,found,response;passedArguments=passedArguments||queryArguments;context=element||context;if(typeof query=='string'&&object!==undefined){query=query.split(/[\. ]/);maxDepth=query.length-1;$.each(query,function(depth,value){var camelCaseValue=depth!=maxDepth?value+query[depth+1].charAt(0).toUpperCase()+query[depth+1].slice(1):query;if($.isPlainObject(object[camelCaseValue])&&depth!=maxDepth){object=object[camelCaseValue];}else if(object[camelCaseValue]!==undefined){found=object[camelCaseValue];return false;}else if($.isPlainObject(object[value])&&depth!=maxDepth){object=object[value];}else if(object[value]!==undefined){found=object[value];return false;}else{module.error(error.method,query);return false;}});}if($.isFunction(found)){response=found.apply(context,passedArguments);}else if(found!==undefined){response=found;}if($.isArray(returnedValue)){returnedValue.push(response);}else if(returnedValue!==undefined){returnedValue=[returnedValue,response];}else if(response!==undefined){returnedValue=response;}return found;}};module.preinitialize();if(methodInvoked){if(instance===undefined){module.initialize();}module.invoke(query);}else{if(instance!==undefined){instance.invoke('destroy');}module.initialize();}});return returnedValue!==undefined?returnedValue:this;};$.fn.dimmer.settings={name:'Dimmer',namespace:'dimmer',silent:false,debug:false,verbose:false,performance:true,// name to distinguish between multiple dimmers in context
dimmerName:false,// whether to add a variation type
variation:false,// whether to bind close events
closable:'auto',// whether to use css animations
useCSS:true,// css animation to use
transition:'fade',// event to bind to
on:false,// overriding opacity value
opacity:'auto',// transition durations
duration:{show:500,hide:500},onChange:function onChange(){},onShow:function onShow(){},onHide:function onHide(){},error:{method:'The method you called is not defined.'},className:{active:'active',animating:'animating',dimmable:'dimmable',dimmed:'dimmed',dimmer:'dimmer',disabled:'disabled',hide:'hide',pageDimmer:'page',show:'show'},selector:{dimmer:'> .ui.dimmer',content:'.ui.dimmer > .content, .ui.dimmer > .content > .center'},template:{dimmer:function dimmer(){return $('<div />').attr('class','ui dimmer');}}};})(jQuery,window,document);/*!
 * # Semantic UI 2.2.11 - Dropdown
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */;(function($,window,document,undefined){"use strict";window=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();$.fn.dropdown=function(parameters){var $allModules=$(this),$document=$(document),moduleSelector=$allModules.selector||'',hasTouch='ontouchstart'in document.documentElement,time=new Date().getTime(),performance=[],query=arguments[0],methodInvoked=typeof query=='string',queryArguments=[].slice.call(arguments,1),returnedValue;$allModules.each(function(elementIndex){var settings=$.isPlainObject(parameters)?$.extend(true,{},$.fn.dropdown.settings,parameters):$.extend({},$.fn.dropdown.settings),className=settings.className,message=settings.message,fields=settings.fields,keys=settings.keys,metadata=settings.metadata,namespace=settings.namespace,regExp=settings.regExp,selector=settings.selector,error=settings.error,templates=settings.templates,eventNamespace='.'+namespace,moduleNamespace='module-'+namespace,$module=$(this),$context=$(settings.context),$text=$module.find(selector.text),$search=$module.find(selector.search),$sizer=$module.find(selector.sizer),$input=$module.find(selector.input),$icon=$module.find(selector.icon),$combo=$module.prev().find(selector.text).length>0?$module.prev().find(selector.text):$module.prev(),$menu=$module.children(selector.menu),$item=$menu.find(selector.item),activated=false,itemActivated=false,internalChange=false,element=this,instance=$module.data(moduleNamespace),_initialLoad2,pageLostFocus,willRefocus,elementNamespace,_id,_selectObserver,_menuObserver,module;module={initialize:function initialize(){module.debug('Initializing dropdown',settings);if(module.is.alreadySetup()){module.setup.reference();}else{module.setup.layout();module.refreshData();module.save.defaults();module.restore.selected();module.create.id();module.bind.events();module.observeChanges();module.instantiate();}},instantiate:function instantiate(){module.verbose('Storing instance of dropdown',module);instance=module;$module.data(moduleNamespace,module);},destroy:function destroy(){module.verbose('Destroying previous dropdown',$module);module.remove.tabbable();$module.off(eventNamespace).removeData(moduleNamespace);$menu.off(eventNamespace);$document.off(elementNamespace);module.disconnect.menuObserver();module.disconnect.selectObserver();},observeChanges:function observeChanges(){if('MutationObserver'in window){_selectObserver=new MutationObserver(module.event.select.mutation);_menuObserver=new MutationObserver(module.event.menu.mutation);module.debug('Setting up mutation observer',_selectObserver,_menuObserver);module.observe.select();module.observe.menu();}},disconnect:{menuObserver:function menuObserver(){if(_menuObserver){_menuObserver.disconnect();}},selectObserver:function selectObserver(){if(_selectObserver){_selectObserver.disconnect();}}},observe:{select:function select(){if(module.has.input()){_selectObserver.observe($input[0],{childList:true,subtree:true});}},menu:function menu(){if(module.has.menu()){_menuObserver.observe($menu[0],{childList:true,subtree:true});}}},create:{id:function id(){_id=(Math.random().toString(16)+'000000000').substr(2,8);elementNamespace='.'+_id;module.verbose('Creating unique id for element',_id);},userChoice:function userChoice(values){var $userChoices,$userChoice,isUserValue,html;values=values||module.get.userValues();if(!values){return false;}values=$.isArray(values)?values:[values];$.each(values,function(index,value){if(module.get.item(value)===false){html=settings.templates.addition(module.add.variables(message.addResult,value));$userChoice=$('<div />').html(html).attr('data-'+metadata.value,value).attr('data-'+metadata.text,value).addClass(className.addition).addClass(className.item);if(settings.hideAdditions){$userChoice.addClass(className.hidden);}$userChoices=$userChoices===undefined?$userChoice:$userChoices.add($userChoice);module.verbose('Creating user choices for value',value,$userChoice);}});return $userChoices;},userLabels:function userLabels(value){var userValues=module.get.userValues();if(userValues){module.debug('Adding user labels',userValues);$.each(userValues,function(index,value){module.verbose('Adding custom user value');module.add.label(value,value);});}},menu:function menu(){$menu=$('<div />').addClass(className.menu).appendTo($module);},sizer:function sizer(){$sizer=$('<span />').addClass(className.sizer).insertAfter($search);}},search:function search(query){query=query!==undefined?query:module.get.query();module.verbose('Searching for query',query);if(module.has.minCharacters(query)){module.filter(query);}else{module.hide();}},select:{firstUnfiltered:function firstUnfiltered(){module.verbose('Selecting first non-filtered element');module.remove.selectedItem();$item.not(selector.unselectable).not(selector.addition+selector.hidden).eq(0).addClass(className.selected);},nextAvailable:function nextAvailable($selected){$selected=$selected.eq(0);var $nextAvailable=$selected.nextAll(selector.item).not(selector.unselectable).eq(0),$prevAvailable=$selected.prevAll(selector.item).not(selector.unselectable).eq(0),hasNext=$nextAvailable.length>0;if(hasNext){module.verbose('Moving selection to',$nextAvailable);$nextAvailable.addClass(className.selected);}else{module.verbose('Moving selection to',$prevAvailable);$prevAvailable.addClass(className.selected);}}},setup:{api:function api(){var apiSettings={debug:settings.debug,urlData:{value:module.get.value(),query:module.get.query()},on:false};module.verbose('First request, initializing API');$module.api(apiSettings);},layout:function layout(){if($module.is('select')){module.setup.select();module.setup.returnedObject();}if(!module.has.menu()){module.create.menu();}if(module.is.search()&&!module.has.search()){module.verbose('Adding search input');$search=$('<input />').addClass(className.search).prop('autocomplete','off').insertBefore($text);}if(module.is.multiple()&&module.is.searchSelection()&&!module.has.sizer()){module.create.sizer();}if(settings.allowTab){module.set.tabbable();}},select:function select(){var selectValues=module.get.selectValues();module.debug('Dropdown initialized on a select',selectValues);if($module.is('select')){$input=$module;}// see if select is placed correctly already
if($input.parent(selector.dropdown).length>0){module.debug('UI dropdown already exists. Creating dropdown menu only');$module=$input.closest(selector.dropdown);if(!module.has.menu()){module.create.menu();}$menu=$module.children(selector.menu);module.setup.menu(selectValues);}else{module.debug('Creating entire dropdown from select');$module=$('<div />').attr('class',$input.attr('class')).addClass(className.selection).addClass(className.dropdown).html(templates.dropdown(selectValues)).insertBefore($input);if($input.hasClass(className.multiple)&&$input.prop('multiple')===false){module.error(error.missingMultiple);$input.prop('multiple',true);}if($input.is('[multiple]')){module.set.multiple();}if($input.prop('disabled')){module.debug('Disabling dropdown');$module.addClass(className.disabled);}$input.removeAttr('class').detach().prependTo($module);}module.refresh();},menu:function menu(values){$menu.html(templates.menu(values,fields));$item=$menu.find(selector.item);},reference:function reference(){module.debug('Dropdown behavior was called on select, replacing with closest dropdown');// replace module reference
$module=$module.parent(selector.dropdown);module.refresh();module.setup.returnedObject();// invoke method in context of current instance
if(methodInvoked){instance=module;module.invoke(query);}},returnedObject:function returnedObject(){var $firstModules=$allModules.slice(0,elementIndex),$lastModules=$allModules.slice(elementIndex+1);// adjust all modules to use correct reference
$allModules=$firstModules.add($module).add($lastModules);}},refresh:function refresh(){module.refreshSelectors();module.refreshData();},refreshItems:function refreshItems(){$item=$menu.find(selector.item);},refreshSelectors:function refreshSelectors(){module.verbose('Refreshing selector cache');$text=$module.find(selector.text);$search=$module.find(selector.search);$input=$module.find(selector.input);$icon=$module.find(selector.icon);$combo=$module.prev().find(selector.text).length>0?$module.prev().find(selector.text):$module.prev();$menu=$module.children(selector.menu);$item=$menu.find(selector.item);},refreshData:function refreshData(){module.verbose('Refreshing cached metadata');$item.removeData(metadata.text).removeData(metadata.value);},clearData:function clearData(){module.verbose('Clearing metadata');$item.removeData(metadata.text).removeData(metadata.value);$module.removeData(metadata.defaultText).removeData(metadata.defaultValue).removeData(metadata.placeholderText);},toggle:function toggle(){module.verbose('Toggling menu visibility');if(!module.is.active()){module.show();}else{module.hide();}},show:function show(callback){callback=$.isFunction(callback)?callback:function(){};if(!module.can.show()&&module.is.remote()){module.debug('No API results retrieved, searching before show');module.queryRemote(module.get.query(),module.show);}if(module.can.show()&&!module.is.active()){module.debug('Showing dropdown');if(module.has.message()&&!(module.has.maxSelections()||module.has.allResultsFiltered())){module.remove.message();}if(module.is.allFiltered()){return true;}if(settings.onShow.call(element)!==false){module.animate.show(function(){if(module.can.click()){module.bind.intent();}if(module.has.menuSearch()){module.focusSearch();}module.set.visible();callback.call(element);});}}},hide:function hide(callback){callback=$.isFunction(callback)?callback:function(){};if(module.is.active()){module.debug('Hiding dropdown');if(settings.onHide.call(element)!==false){module.animate.hide(function(){module.remove.visible();callback.call(element);});}}},hideOthers:function hideOthers(){module.verbose('Finding other dropdowns to hide');$allModules.not($module).has(selector.menu+'.'+className.visible).dropdown('hide');},hideMenu:function hideMenu(){module.verbose('Hiding menu  instantaneously');module.remove.active();module.remove.visible();$menu.transition('hide');},hideSubMenus:function hideSubMenus(){var $subMenus=$menu.children(selector.item).find(selector.menu);module.verbose('Hiding sub menus',$subMenus);$subMenus.transition('hide');},bind:{events:function events(){if(hasTouch){module.bind.touchEvents();}module.bind.keyboardEvents();module.bind.inputEvents();module.bind.mouseEvents();},touchEvents:function touchEvents(){module.debug('Touch device detected binding additional touch events');if(module.is.searchSelection()){// do nothing special yet
}else if(module.is.single()){$module.on('touchstart'+eventNamespace,module.event.test.toggle);}$menu.on('touchstart'+eventNamespace,selector.item,module.event.item.mouseenter);},keyboardEvents:function keyboardEvents(){module.verbose('Binding keyboard events');$module.on('keydown'+eventNamespace,module.event.keydown);if(module.has.search()){$module.on(module.get.inputEvent()+eventNamespace,selector.search,module.event.input);}if(module.is.multiple()){$document.on('keydown'+elementNamespace,module.event.document.keydown);}},inputEvents:function inputEvents(){module.verbose('Binding input change events');$module.on('change'+eventNamespace,selector.input,module.event.change);},mouseEvents:function mouseEvents(){module.verbose('Binding mouse events');if(module.is.multiple()){$module.on('click'+eventNamespace,selector.label,module.event.label.click).on('click'+eventNamespace,selector.remove,module.event.remove.click);}if(module.is.searchSelection()){$module.on('mousedown'+eventNamespace,module.event.mousedown).on('mouseup'+eventNamespace,module.event.mouseup).on('mousedown'+eventNamespace,selector.menu,module.event.menu.mousedown).on('mouseup'+eventNamespace,selector.menu,module.event.menu.mouseup).on('click'+eventNamespace,selector.icon,module.event.icon.click).on('focus'+eventNamespace,selector.search,module.event.search.focus).on('click'+eventNamespace,selector.search,module.event.search.focus).on('blur'+eventNamespace,selector.search,module.event.search.blur).on('click'+eventNamespace,selector.text,module.event.text.focus);if(module.is.multiple()){$module.on('click'+eventNamespace,module.event.click);}}else{if(settings.on=='click'){$module.on('click'+eventNamespace,selector.icon,module.event.icon.click).on('click'+eventNamespace,module.event.test.toggle);}else if(settings.on=='hover'){$module.on('mouseenter'+eventNamespace,module.delay.show).on('mouseleave'+eventNamespace,module.delay.hide);}else{$module.on(settings.on+eventNamespace,module.toggle);}$module.on('mousedown'+eventNamespace,module.event.mousedown).on('mouseup'+eventNamespace,module.event.mouseup).on('focus'+eventNamespace,module.event.focus);if(module.has.menuSearch()){$module.on('blur'+eventNamespace,selector.search,module.event.search.blur);}else{$module.on('blur'+eventNamespace,module.event.blur);}}$menu.on('mouseenter'+eventNamespace,selector.item,module.event.item.mouseenter).on('mouseleave'+eventNamespace,selector.item,module.event.item.mouseleave).on('click'+eventNamespace,selector.item,module.event.item.click);},intent:function intent(){module.verbose('Binding hide intent event to document');if(hasTouch){$document.on('touchstart'+elementNamespace,module.event.test.touch).on('touchmove'+elementNamespace,module.event.test.touch);}$document.on('click'+elementNamespace,module.event.test.hide);}},unbind:{intent:function intent(){module.verbose('Removing hide intent event from document');if(hasTouch){$document.off('touchstart'+elementNamespace).off('touchmove'+elementNamespace);}$document.off('click'+elementNamespace);}},filter:function filter(query){var searchTerm=query!==undefined?query:module.get.query(),afterFiltered=function afterFiltered(){if(module.is.multiple()){module.filterActive();}if(query||!query&&module.get.activeItem().length==0){module.select.firstUnfiltered();}if(module.has.allResultsFiltered()){if(settings.onNoResults.call(element,searchTerm)){if(settings.allowAdditions){if(settings.hideAdditions){module.verbose('User addition with no menu, setting empty style');module.set.empty();module.hideMenu();}}else{module.verbose('All items filtered, showing message',searchTerm);module.add.message(message.noResults);}}else{module.verbose('All items filtered, hiding dropdown',searchTerm);module.hideMenu();}}else{module.remove.empty();module.remove.message();}if(settings.allowAdditions){module.add.userSuggestion(query);}if(module.is.searchSelection()&&module.can.show()&&module.is.focusedOnSearch()){module.show();}};if(settings.useLabels&&module.has.maxSelections()){return;}if(settings.apiSettings){if(module.can.useAPI()){module.queryRemote(searchTerm,function(){if(settings.filterRemoteData){module.filterItems(searchTerm);}afterFiltered();});}else{module.error(error.noAPI);}}else{module.filterItems(searchTerm);afterFiltered();}},queryRemote:function queryRemote(query,callback){var apiSettings={errorDuration:false,cache:'local',throttle:settings.throttle,urlData:{query:query},onError:function onError(){module.add.message(message.serverError);callback();},onFailure:function onFailure(){module.add.message(message.serverError);callback();},onSuccess:function onSuccess(response){module.remove.message();module.setup.menu({values:response[fields.remoteValues]});callback();}};if(!$module.api('get request')){module.setup.api();}apiSettings=$.extend(true,{},apiSettings,settings.apiSettings);$module.api('setting',apiSettings).api('query');},filterItems:function filterItems(query){var searchTerm=query!==undefined?query:module.get.query(),results=null,escapedTerm=module.escape.string(searchTerm),beginsWithRegExp=new RegExp('^'+escapedTerm,'igm');// avoid loop if we're matching nothing
if(module.has.query()){results=[];module.verbose('Searching for matching values',searchTerm);$item.each(function(){var $choice=$(this),text,value;if(settings.match=='both'||settings.match=='text'){text=String(module.get.choiceText($choice,false));if(text.search(beginsWithRegExp)!==-1){results.push(this);return true;}else if(settings.fullTextSearch==='exact'&&module.exactSearch(searchTerm,text)){results.push(this);return true;}else if(settings.fullTextSearch===true&&module.fuzzySearch(searchTerm,text)){results.push(this);return true;}}if(settings.match=='both'||settings.match=='value'){value=String(module.get.choiceValue($choice,text));if(value.search(beginsWithRegExp)!==-1){results.push(this);return true;}else if(settings.fullTextSearch==='exact'&&module.exactSearch(searchTerm,value)){results.push(this);return true;}else if(settings.fullTextSearch===true&&module.fuzzySearch(searchTerm,value)){results.push(this);return true;}}});}module.debug('Showing only matched items',searchTerm);module.remove.filteredItem();if(results){$item.not(results).addClass(className.filtered);}},fuzzySearch:function fuzzySearch(query,term){var termLength=term.length,queryLength=query.length;query=query.toLowerCase();term=term.toLowerCase();if(queryLength>termLength){return false;}if(queryLength===termLength){return query===term;}search:for(var characterIndex=0,nextCharacterIndex=0;characterIndex<queryLength;characterIndex++){var queryCharacter=query.charCodeAt(characterIndex);while(nextCharacterIndex<termLength){if(term.charCodeAt(nextCharacterIndex++)===queryCharacter){continue search;}}return false;}return true;},exactSearch:function exactSearch(query,term){query=query.toLowerCase();term=term.toLowerCase();if(term.indexOf(query)>-1){return true;}return false;},filterActive:function filterActive(){if(settings.useLabels){$item.filter('.'+className.active).addClass(className.filtered);}},focusSearch:function focusSearch(skipHandler){if(module.has.search()&&!module.is.focusedOnSearch()){if(skipHandler){$module.off('focus'+eventNamespace,selector.search);$search.focus();$module.on('focus'+eventNamespace,selector.search,module.event.search.focus);}else{$search.focus();}}},forceSelection:function forceSelection(){var $currentlySelected=$item.not(className.filtered).filter('.'+className.selected).eq(0),$activeItem=$item.not(className.filtered).filter('.'+className.active).eq(0),$selectedItem=$currentlySelected.length>0?$currentlySelected:$activeItem,hasSelected=$selectedItem.length>0;if(hasSelected&&!module.is.multiple()){module.debug('Forcing partial selection to selected item',$selectedItem);module.event.item.click.call($selectedItem,{},true);return;}else{if(settings.allowAdditions){module.set.selected(module.get.query());module.remove.searchTerm();}else{module.remove.searchTerm();}}},event:{change:function change(){if(!internalChange){module.debug('Input changed, updating selection');module.set.selected();}},focus:function focus(){if(settings.showOnFocus&&!activated&&module.is.hidden()&&!pageLostFocus){module.show();}},blur:function blur(event){pageLostFocus=document.activeElement===this;if(!activated&&!pageLostFocus){module.remove.activeLabel();module.hide();}},mousedown:function mousedown(){if(module.is.searchSelection()){// prevent menu hiding on immediate re-focus
willRefocus=true;}else{// prevents focus callback from occurring on mousedown
activated=true;}},mouseup:function mouseup(){if(module.is.searchSelection()){// prevent menu hiding on immediate re-focus
willRefocus=false;}else{activated=false;}},click:function click(event){var $target=$(event.target);// focus search
if($target.is($module)){if(!module.is.focusedOnSearch()){module.focusSearch();}else{module.show();}}},search:{focus:function focus(){activated=true;if(module.is.multiple()){module.remove.activeLabel();}if(settings.showOnFocus){module.search();}},blur:function blur(event){pageLostFocus=document.activeElement===this;if(module.is.searchSelection()&&!willRefocus){if(!itemActivated&&!pageLostFocus){if(settings.forceSelection){module.forceSelection();}module.hide();}}willRefocus=false;}},icon:{click:function click(event){module.toggle();}},text:{focus:function focus(event){activated=true;module.focusSearch();}},input:function input(event){if(module.is.multiple()||module.is.searchSelection()){module.set.filtered();}clearTimeout(module.timer);module.timer=setTimeout(module.search,settings.delay.search);},label:{click:function click(event){var $label=$(this),$labels=$module.find(selector.label),$activeLabels=$labels.filter('.'+className.active),$nextActive=$label.nextAll('.'+className.active),$prevActive=$label.prevAll('.'+className.active),$range=$nextActive.length>0?$label.nextUntil($nextActive).add($activeLabels).add($label):$label.prevUntil($prevActive).add($activeLabels).add($label);if(event.shiftKey){$activeLabels.removeClass(className.active);$range.addClass(className.active);}else if(event.ctrlKey){$label.toggleClass(className.active);}else{$activeLabels.removeClass(className.active);$label.addClass(className.active);}settings.onLabelSelect.apply(this,$labels.filter('.'+className.active));}},remove:{click:function click(){var $label=$(this).parent();if($label.hasClass(className.active)){// remove all selected labels
module.remove.activeLabels();}else{// remove this label only
module.remove.activeLabels($label);}}},test:{toggle:function toggle(event){var toggleBehavior=module.is.multiple()?module.show:module.toggle;if(module.is.bubbledLabelClick(event)||module.is.bubbledIconClick(event)){return;}if(module.determine.eventOnElement(event,toggleBehavior)){event.preventDefault();}},touch:function touch(event){module.determine.eventOnElement(event,function(){if(event.type=='touchstart'){module.timer=setTimeout(function(){module.hide();},settings.delay.touch);}else if(event.type=='touchmove'){clearTimeout(module.timer);}});event.stopPropagation();},hide:function hide(event){module.determine.eventInModule(event,module.hide);}},select:{mutation:function mutation(mutations){module.debug('<select> modified, recreating menu');module.setup.select();}},menu:{mutation:function mutation(mutations){var mutation=mutations[0],$addedNode=mutation.addedNodes?$(mutation.addedNodes[0]):$(false),$removedNode=mutation.removedNodes?$(mutation.removedNodes[0]):$(false),$changedNodes=$addedNode.add($removedNode),isUserAddition=$changedNodes.is(selector.addition)||$changedNodes.closest(selector.addition).length>0,isMessage=$changedNodes.is(selector.message)||$changedNodes.closest(selector.message).length>0;if(isUserAddition||isMessage){module.debug('Updating item selector cache');module.refreshItems();}else{module.debug('Menu modified, updating selector cache');module.refresh();}},mousedown:function mousedown(){itemActivated=true;},mouseup:function mouseup(){itemActivated=false;}},item:{mouseenter:function mouseenter(event){var $target=$(event.target),$item=$(this),$subMenu=$item.children(selector.menu),$otherMenus=$item.siblings(selector.item).children(selector.menu),hasSubMenu=$subMenu.length>0,isBubbledEvent=$subMenu.find($target).length>0;if(!isBubbledEvent&&hasSubMenu){clearTimeout(module.itemTimer);module.itemTimer=setTimeout(function(){module.verbose('Showing sub-menu',$subMenu);$.each($otherMenus,function(){module.animate.hide(false,$(this));});module.animate.show(false,$subMenu);},settings.delay.show);event.preventDefault();}},mouseleave:function mouseleave(event){var $subMenu=$(this).children(selector.menu);if($subMenu.length>0){clearTimeout(module.itemTimer);module.itemTimer=setTimeout(function(){module.verbose('Hiding sub-menu',$subMenu);module.animate.hide(false,$subMenu);},settings.delay.hide);}},click:function click(event,skipRefocus){var $choice=$(this),$target=event?$(event.target):$(''),$subMenu=$choice.find(selector.menu),text=module.get.choiceText($choice),value=module.get.choiceValue($choice,text),hasSubMenu=$subMenu.length>0,isBubbledEvent=$subMenu.find($target).length>0;// prevents IE11 bug where menu receives focus even though `tabindex=-1`
if(module.has.menuSearch()){$(document.activeElement).blur();}if(!isBubbledEvent&&(!hasSubMenu||settings.allowCategorySelection)){if(module.is.searchSelection()){if(settings.allowAdditions){module.remove.userAddition();}module.remove.searchTerm();if(!module.is.focusedOnSearch()&&!(skipRefocus==true)){module.focusSearch(true);}}if(!settings.useLabels){module.remove.filteredItem();module.set.scrollPosition($choice);}module.determine.selectAction.call(this,text,value);}}},document:{// label selection should occur even when element has no focus
keydown:function keydown(event){var pressedKey=event.which,isShortcutKey=module.is.inObject(pressedKey,keys);if(isShortcutKey){var $label=$module.find(selector.label),$activeLabel=$label.filter('.'+className.active),activeValue=$activeLabel.data(metadata.value),labelIndex=$label.index($activeLabel),labelCount=$label.length,hasActiveLabel=$activeLabel.length>0,hasMultipleActive=$activeLabel.length>1,isFirstLabel=labelIndex===0,isLastLabel=labelIndex+1==labelCount,isSearch=module.is.searchSelection(),isFocusedOnSearch=module.is.focusedOnSearch(),isFocused=module.is.focused(),caretAtStart=isFocusedOnSearch&&module.get.caretPosition()===0,$nextLabel;if(isSearch&&!hasActiveLabel&&!isFocusedOnSearch){return;}if(pressedKey==keys.leftArrow){// activate previous label
if((isFocused||caretAtStart)&&!hasActiveLabel){module.verbose('Selecting previous label');$label.last().addClass(className.active);}else if(hasActiveLabel){if(!event.shiftKey){module.verbose('Selecting previous label');$label.removeClass(className.active);}else{module.verbose('Adding previous label to selection');}if(isFirstLabel&&!hasMultipleActive){$activeLabel.addClass(className.active);}else{$activeLabel.prev(selector.siblingLabel).addClass(className.active).end();}event.preventDefault();}}else if(pressedKey==keys.rightArrow){// activate first label
if(isFocused&&!hasActiveLabel){$label.first().addClass(className.active);}// activate next label
if(hasActiveLabel){if(!event.shiftKey){module.verbose('Selecting next label');$label.removeClass(className.active);}else{module.verbose('Adding next label to selection');}if(isLastLabel){if(isSearch){if(!isFocusedOnSearch){module.focusSearch();}else{$label.removeClass(className.active);}}else if(hasMultipleActive){$activeLabel.next(selector.siblingLabel).addClass(className.active);}else{$activeLabel.addClass(className.active);}}else{$activeLabel.next(selector.siblingLabel).addClass(className.active);}event.preventDefault();}}else if(pressedKey==keys.deleteKey||pressedKey==keys.backspace){if(hasActiveLabel){module.verbose('Removing active labels');if(isLastLabel){if(isSearch&&!isFocusedOnSearch){module.focusSearch();}}$activeLabel.last().next(selector.siblingLabel).addClass(className.active);module.remove.activeLabels($activeLabel);event.preventDefault();}else if(caretAtStart&&!hasActiveLabel&&pressedKey==keys.backspace){module.verbose('Removing last label on input backspace');$activeLabel=$label.last().addClass(className.active);module.remove.activeLabels($activeLabel);}}else{$activeLabel.removeClass(className.active);}}}},keydown:function keydown(event){var pressedKey=event.which,isShortcutKey=module.is.inObject(pressedKey,keys);if(isShortcutKey){var $currentlySelected=$item.not(selector.unselectable).filter('.'+className.selected).eq(0),$activeItem=$menu.children('.'+className.active).eq(0),$selectedItem=$currentlySelected.length>0?$currentlySelected:$activeItem,$visibleItems=$selectedItem.length>0?$selectedItem.siblings(':not(.'+className.filtered+')').addBack():$menu.children(':not(.'+className.filtered+')'),$subMenu=$selectedItem.children(selector.menu),$parentMenu=$selectedItem.closest(selector.menu),inVisibleMenu=$parentMenu.hasClass(className.visible)||$parentMenu.hasClass(className.animating)||$parentMenu.parent(selector.menu).length>0,hasSubMenu=$subMenu.length>0,hasSelectedItem=$selectedItem.length>0,selectedIsSelectable=$selectedItem.not(selector.unselectable).length>0,delimiterPressed=pressedKey==keys.delimiter&&settings.allowAdditions&&module.is.multiple(),isAdditionWithoutMenu=settings.allowAdditions&&settings.hideAdditions&&(pressedKey==keys.enter||delimiterPressed)&&selectedIsSelectable,$nextItem,isSubMenuItem,newIndex;// allow selection with menu closed
if(isAdditionWithoutMenu){module.verbose('Selecting item from keyboard shortcut',$selectedItem);module.event.item.click.call($selectedItem,event);if(module.is.searchSelection()){module.remove.searchTerm();}}// visible menu keyboard shortcuts
if(module.is.visible()){// enter (select or open sub-menu)
if(pressedKey==keys.enter||delimiterPressed){if(pressedKey==keys.enter&&hasSelectedItem&&hasSubMenu&&!settings.allowCategorySelection){module.verbose('Pressed enter on unselectable category, opening sub menu');pressedKey=keys.rightArrow;}else if(selectedIsSelectable){module.verbose('Selecting item from keyboard shortcut',$selectedItem);module.event.item.click.call($selectedItem,event);if(module.is.searchSelection()){module.remove.searchTerm();}}event.preventDefault();}// sub-menu actions
if(hasSelectedItem){if(pressedKey==keys.leftArrow){isSubMenuItem=$parentMenu[0]!==$menu[0];if(isSubMenuItem){module.verbose('Left key pressed, closing sub-menu');module.animate.hide(false,$parentMenu);$selectedItem.removeClass(className.selected);$parentMenu.closest(selector.item).addClass(className.selected);event.preventDefault();}}// right arrow (show sub-menu)
if(pressedKey==keys.rightArrow){if(hasSubMenu){module.verbose('Right key pressed, opening sub-menu');module.animate.show(false,$subMenu);$selectedItem.removeClass(className.selected);$subMenu.find(selector.item).eq(0).addClass(className.selected);event.preventDefault();}}}// up arrow (traverse menu up)
if(pressedKey==keys.upArrow){$nextItem=hasSelectedItem&&inVisibleMenu?$selectedItem.prevAll(selector.item+':not('+selector.unselectable+')').eq(0):$item.eq(0);if($visibleItems.index($nextItem)<0){module.verbose('Up key pressed but reached top of current menu');event.preventDefault();return;}else{module.verbose('Up key pressed, changing active item');$selectedItem.removeClass(className.selected);$nextItem.addClass(className.selected);module.set.scrollPosition($nextItem);if(settings.selectOnKeydown&&module.is.single()){module.set.selectedItem($nextItem);}}event.preventDefault();}// down arrow (traverse menu down)
if(pressedKey==keys.downArrow){$nextItem=hasSelectedItem&&inVisibleMenu?$nextItem=$selectedItem.nextAll(selector.item+':not('+selector.unselectable+')').eq(0):$item.eq(0);if($nextItem.length===0){module.verbose('Down key pressed but reached bottom of current menu');event.preventDefault();return;}else{module.verbose('Down key pressed, changing active item');$item.removeClass(className.selected);$nextItem.addClass(className.selected);module.set.scrollPosition($nextItem);if(settings.selectOnKeydown&&module.is.single()){module.set.selectedItem($nextItem);}}event.preventDefault();}// page down (show next page)
if(pressedKey==keys.pageUp){module.scrollPage('up');event.preventDefault();}if(pressedKey==keys.pageDown){module.scrollPage('down');event.preventDefault();}// escape (close menu)
if(pressedKey==keys.escape){module.verbose('Escape key pressed, closing dropdown');module.hide();}}else{// delimiter key
if(delimiterPressed){event.preventDefault();}// down arrow (open menu)
if(pressedKey==keys.downArrow&&!module.is.visible()){module.verbose('Down key pressed, showing dropdown');module.show();event.preventDefault();}}}else{if(!module.has.search()){module.set.selectedLetter(String.fromCharCode(pressedKey));}}}},trigger:{change:function change(){var events=document.createEvent('HTMLEvents'),inputElement=$input[0];if(inputElement){module.verbose('Triggering native change event');events.initEvent('change',true,false);inputElement.dispatchEvent(events);}}},determine:{selectAction:function selectAction(text,value){module.verbose('Determining action',settings.action);if($.isFunction(module.action[settings.action])){module.verbose('Triggering preset action',settings.action,text,value);module.action[settings.action].call(element,text,value,this);}else if($.isFunction(settings.action)){module.verbose('Triggering user action',settings.action,text,value);settings.action.call(element,text,value,this);}else{module.error(error.action,settings.action);}},eventInModule:function eventInModule(event,callback){var $target=$(event.target),inDocument=$target.closest(document.documentElement).length>0,inModule=$target.closest($module).length>0;callback=$.isFunction(callback)?callback:function(){};if(inDocument&&!inModule){module.verbose('Triggering event',callback);callback();return true;}else{module.verbose('Event occurred in dropdown, canceling callback');return false;}},eventOnElement:function eventOnElement(event,callback){var $target=$(event.target),$label=$target.closest(selector.siblingLabel),inVisibleDOM=document.body.contains(event.target),notOnLabel=$module.find($label).length===0,notInMenu=$target.closest($menu).length===0;callback=$.isFunction(callback)?callback:function(){};if(inVisibleDOM&&notOnLabel&&notInMenu){module.verbose('Triggering event',callback);callback();return true;}else{module.verbose('Event occurred in dropdown menu, canceling callback');return false;}}},action:{nothing:function nothing(){},activate:function activate(text,value,element){value=value!==undefined?value:text;if(module.can.activate($(element))){module.set.selected(value,$(element));if(module.is.multiple()&&!module.is.allFiltered()){return;}else{module.hideAndClear();}}},select:function select(text,value,element){value=value!==undefined?value:text;if(module.can.activate($(element))){module.set.value(value,$(element));if(module.is.multiple()&&!module.is.allFiltered()){return;}else{module.hideAndClear();}}},combo:function combo(text,value,element){value=value!==undefined?value:text;module.set.selected(value,$(element));module.hideAndClear();},hide:function hide(text,value,element){module.set.value(value,text);module.hideAndClear();}},get:{id:function id(){return _id;},defaultText:function defaultText(){return $module.data(metadata.defaultText);},defaultValue:function defaultValue(){return $module.data(metadata.defaultValue);},placeholderText:function placeholderText(){return $module.data(metadata.placeholderText)||'';},text:function text(){return $text.text();},query:function query(){return $.trim($search.val());},searchWidth:function searchWidth(value){value=value!==undefined?value:$search.val();$sizer.text(value);// prevent rounding issues
return Math.ceil($sizer.width()+1);},selectionCount:function selectionCount(){var values=module.get.values(),count;count=module.is.multiple()?$.isArray(values)?values.length:0:module.get.value()!==''?1:0;return count;},transition:function transition($subMenu){return settings.transition=='auto'?module.is.upward($subMenu)?'slide up':'slide down':settings.transition;},userValues:function userValues(){var values=module.get.values();if(!values){return false;}values=$.isArray(values)?values:[values];return $.grep(values,function(value){return module.get.item(value)===false;});},uniqueArray:function uniqueArray(array){return $.grep(array,function(value,index){return $.inArray(value,array)===index;});},caretPosition:function caretPosition(){var input=$search.get(0),range,rangeLength;if('selectionStart'in input){return input.selectionStart;}else if(document.selection){input.focus();range=document.selection.createRange();rangeLength=range.text.length;range.moveStart('character',-input.value.length);return range.text.length-rangeLength;}},value:function value(){var value=$input.length>0?$input.val():$module.data(metadata.value),isEmptyMultiselect=$.isArray(value)&&value.length===1&&value[0]==='';// prevents placeholder element from being selected when multiple
return value===undefined||isEmptyMultiselect?'':value;},values:function values(){var value=module.get.value();if(value===''){return'';}return!module.has.selectInput()&&module.is.multiple()?typeof value=='string'?// delimited string
value.split(settings.delimiter):'':value;},remoteValues:function remoteValues(){var values=module.get.values(),remoteValues=false;if(values){if(typeof values=='string'){values=[values];}$.each(values,function(index,value){var name=module.read.remoteData(value);module.verbose('Restoring value from session data',name,value);if(name){if(!remoteValues){remoteValues={};}remoteValues[value]=name;}});}return remoteValues;},choiceText:function choiceText($choice,preserveHTML){preserveHTML=preserveHTML!==undefined?preserveHTML:settings.preserveHTML;if($choice){if($choice.find(selector.menu).length>0){module.verbose('Retrieving text of element with sub-menu');$choice=$choice.clone();$choice.find(selector.menu).remove();$choice.find(selector.menuIcon).remove();}return $choice.data(metadata.text)!==undefined?$choice.data(metadata.text):preserveHTML?$.trim($choice.html()):$.trim($choice.text());}},choiceValue:function choiceValue($choice,choiceText){choiceText=choiceText||module.get.choiceText($choice);if(!$choice){return false;}return $choice.data(metadata.value)!==undefined?String($choice.data(metadata.value)):typeof choiceText==='string'?$.trim(choiceText.toLowerCase()):String(choiceText);},inputEvent:function inputEvent(){var input=$search[0];if(input){return input.oninput!==undefined?'input':input.onpropertychange!==undefined?'propertychange':'keyup';}return false;},selectValues:function selectValues(){var select={};select.values=[];$module.find('option').each(function(){var $option=$(this),name=$option.html(),disabled=$option.attr('disabled'),value=$option.attr('value')!==undefined?$option.attr('value'):name;if(settings.placeholder==='auto'&&value===''){select.placeholder=name;}else{select.values.push({name:name,value:value,disabled:disabled});}});if(settings.placeholder&&settings.placeholder!=='auto'){module.debug('Setting placeholder value to',settings.placeholder);select.placeholder=settings.placeholder;}if(settings.sortSelect){select.values.sort(function(a,b){return a.name>b.name?1:-1;});module.debug('Retrieved and sorted values from select',select);}else{module.debug('Retrieved values from select',select);}return select;},activeItem:function activeItem(){return $item.filter('.'+className.active);},selectedItem:function selectedItem(){var $selectedItem=$item.not(selector.unselectable).filter('.'+className.selected);return $selectedItem.length>0?$selectedItem:$item.eq(0);},itemWithAdditions:function itemWithAdditions(value){var $items=module.get.item(value),$userItems=module.create.userChoice(value),hasUserItems=$userItems&&$userItems.length>0;if(hasUserItems){$items=$items.length>0?$items.add($userItems):$userItems;}return $items;},item:function item(value,strict){var $selectedItem=false,shouldSearch,isMultiple;value=value!==undefined?value:module.get.values()!==undefined?module.get.values():module.get.text();shouldSearch=isMultiple?value.length>0:value!==undefined&&value!==null;isMultiple=module.is.multiple()&&$.isArray(value);strict=value===''||value===0?true:strict||false;if(shouldSearch){$item.each(function(){var $choice=$(this),optionText=module.get.choiceText($choice),optionValue=module.get.choiceValue($choice,optionText);// safe early exit
if(optionValue===null||optionValue===undefined){return;}if(isMultiple){if($.inArray(String(optionValue),value)!==-1||$.inArray(optionText,value)!==-1){$selectedItem=$selectedItem?$selectedItem.add($choice):$choice;}}else if(strict){module.verbose('Ambiguous dropdown value using strict type check',$choice,value);if(optionValue===value||optionText===value){$selectedItem=$choice;return true;}}else{if(String(optionValue)==String(value)||optionText==value){module.verbose('Found select item by value',optionValue,value);$selectedItem=$choice;return true;}}});}return $selectedItem;}},check:{maxSelections:function maxSelections(selectionCount){if(settings.maxSelections){selectionCount=selectionCount!==undefined?selectionCount:module.get.selectionCount();if(selectionCount>=settings.maxSelections){module.debug('Maximum selection count reached');if(settings.useLabels){$item.addClass(className.filtered);module.add.message(message.maxSelections);}return true;}else{module.verbose('No longer at maximum selection count');module.remove.message();module.remove.filteredItem();if(module.is.searchSelection()){module.filterItems();}return false;}}return true;}},restore:{defaults:function defaults(){module.clear();module.restore.defaultText();module.restore.defaultValue();},defaultText:function defaultText(){var defaultText=module.get.defaultText(),placeholderText=module.get.placeholderText;if(defaultText===placeholderText){module.debug('Restoring default placeholder text',defaultText);module.set.placeholderText(defaultText);}else{module.debug('Restoring default text',defaultText);module.set.text(defaultText);}},placeholderText:function placeholderText(){module.set.placeholderText();},defaultValue:function defaultValue(){var defaultValue=module.get.defaultValue();if(defaultValue!==undefined){module.debug('Restoring default value',defaultValue);if(defaultValue!==''){module.set.value(defaultValue);module.set.selected();}else{module.remove.activeItem();module.remove.selectedItem();}}},labels:function labels(){if(settings.allowAdditions){if(!settings.useLabels){module.error(error.labels);settings.useLabels=true;}module.debug('Restoring selected values');module.create.userLabels();}module.check.maxSelections();},selected:function selected(){module.restore.values();if(module.is.multiple()){module.debug('Restoring previously selected values and labels');module.restore.labels();}else{module.debug('Restoring previously selected values');}},values:function values(){// prevents callbacks from occurring on initial load
module.set.initialLoad();if(settings.apiSettings&&settings.saveRemoteData&&module.get.remoteValues()){module.restore.remoteValues();}else{module.set.selected();}module.remove.initialLoad();},remoteValues:function remoteValues(){var values=module.get.remoteValues();module.debug('Recreating selected from session data',values);if(values){if(module.is.single()){$.each(values,function(value,name){module.set.text(name);});}else{$.each(values,function(value,name){module.add.label(value,name);});}}}},read:{remoteData:function remoteData(value){var name;if(window.Storage===undefined){module.error(error.noStorage);return;}name=sessionStorage.getItem(value);return name!==undefined?name:false;}},save:{defaults:function defaults(){module.save.defaultText();module.save.placeholderText();module.save.defaultValue();},defaultValue:function defaultValue(){var value=module.get.value();module.verbose('Saving default value as',value);$module.data(metadata.defaultValue,value);},defaultText:function defaultText(){var text=module.get.text();module.verbose('Saving default text as',text);$module.data(metadata.defaultText,text);},placeholderText:function placeholderText(){var text;if(settings.placeholder!==false&&$text.hasClass(className.placeholder)){text=module.get.text();module.verbose('Saving placeholder text as',text);$module.data(metadata.placeholderText,text);}},remoteData:function remoteData(name,value){if(window.Storage===undefined){module.error(error.noStorage);return;}module.verbose('Saving remote data to session storage',value,name);sessionStorage.setItem(value,name);}},clear:function clear(){if(module.is.multiple()&&settings.useLabels){module.remove.labels();}else{module.remove.activeItem();module.remove.selectedItem();}module.set.placeholderText();module.clearValue();},clearValue:function clearValue(){module.set.value('');},scrollPage:function scrollPage(direction,$selectedItem){var $currentItem=$selectedItem||module.get.selectedItem(),$menu=$currentItem.closest(selector.menu),menuHeight=$menu.outerHeight(),currentScroll=$menu.scrollTop(),itemHeight=$item.eq(0).outerHeight(),itemsPerPage=Math.floor(menuHeight/itemHeight),maxScroll=$menu.prop('scrollHeight'),newScroll=direction=='up'?currentScroll-itemHeight*itemsPerPage:currentScroll+itemHeight*itemsPerPage,$selectableItem=$item.not(selector.unselectable),isWithinRange,$nextSelectedItem,elementIndex;elementIndex=direction=='up'?$selectableItem.index($currentItem)-itemsPerPage:$selectableItem.index($currentItem)+itemsPerPage;isWithinRange=direction=='up'?elementIndex>=0:elementIndex<$selectableItem.length;$nextSelectedItem=isWithinRange?$selectableItem.eq(elementIndex):direction=='up'?$selectableItem.first():$selectableItem.last();if($nextSelectedItem.length>0){module.debug('Scrolling page',direction,$nextSelectedItem);$currentItem.removeClass(className.selected);$nextSelectedItem.addClass(className.selected);if(settings.selectOnKeydown&&module.is.single()){module.set.selectedItem($nextSelectedItem);}$menu.scrollTop(newScroll);}},set:{filtered:function filtered(){var isMultiple=module.is.multiple(),isSearch=module.is.searchSelection(),isSearchMultiple=isMultiple&&isSearch,searchValue=isSearch?module.get.query():'',hasSearchValue=typeof searchValue==='string'&&searchValue.length>0,searchWidth=module.get.searchWidth(),valueIsSet=searchValue!=='';if(isMultiple&&hasSearchValue){module.verbose('Adjusting input width',searchWidth,settings.glyphWidth);$search.css('width',searchWidth);}if(hasSearchValue||isSearchMultiple&&valueIsSet){module.verbose('Hiding placeholder text');$text.addClass(className.filtered);}else if(!isMultiple||isSearchMultiple&&!valueIsSet){module.verbose('Showing placeholder text');$text.removeClass(className.filtered);}},empty:function empty(){$module.addClass(className.empty);},loading:function loading(){$module.addClass(className.loading);},placeholderText:function placeholderText(text){text=text||module.get.placeholderText();module.debug('Setting placeholder text',text);module.set.text(text);$text.addClass(className.placeholder);},tabbable:function tabbable(){if(module.is.searchSelection()){module.debug('Added tabindex to searchable dropdown');$search.val('').attr('tabindex',0);$menu.attr('tabindex',-1);}else{module.debug('Added tabindex to dropdown');if($module.attr('tabindex')===undefined){$module.attr('tabindex',0);$menu.attr('tabindex',-1);}}},initialLoad:function initialLoad(){module.verbose('Setting initial load');_initialLoad2=true;},activeItem:function activeItem($item){if(settings.allowAdditions&&$item.filter(selector.addition).length>0){$item.addClass(className.filtered);}else{$item.addClass(className.active);}},partialSearch:function partialSearch(text){var length=module.get.query().length;$search.val(text.substr(0,length));},scrollPosition:function scrollPosition($item,forceScroll){var edgeTolerance=5,$menu,hasActive,offset,itemHeight,itemOffset,menuOffset,menuScroll,menuHeight,abovePage,belowPage;$item=$item||module.get.selectedItem();$menu=$item.closest(selector.menu);hasActive=$item&&$item.length>0;forceScroll=forceScroll!==undefined?forceScroll:false;if($item&&$menu.length>0&&hasActive){itemOffset=$item.position().top;$menu.addClass(className.loading);menuScroll=$menu.scrollTop();menuOffset=$menu.offset().top;itemOffset=$item.offset().top;offset=menuScroll-menuOffset+itemOffset;if(!forceScroll){menuHeight=$menu.height();belowPage=menuScroll+menuHeight<offset+edgeTolerance;abovePage=offset-edgeTolerance<menuScroll;}module.debug('Scrolling to active item',offset);if(forceScroll||abovePage||belowPage){$menu.scrollTop(offset);}$menu.removeClass(className.loading);}},text:function text(_text){if(settings.action!=='select'){if(settings.action=='combo'){module.debug('Changing combo button text',_text,$combo);if(settings.preserveHTML){$combo.html(_text);}else{$combo.text(_text);}}else{if(_text!==module.get.placeholderText()){$text.removeClass(className.placeholder);}module.debug('Changing text',_text,$text);$text.removeClass(className.filtered);if(settings.preserveHTML){$text.html(_text);}else{$text.text(_text);}}}},selectedItem:function selectedItem($item){var value=module.get.choiceValue($item),searchText=module.get.choiceText($item,false),text=module.get.choiceText($item,true);module.debug('Setting user selection to item',$item);module.remove.activeItem();module.set.partialSearch(searchText);module.set.activeItem($item);module.set.selected(value,$item);module.set.text(text);},selectedLetter:function selectedLetter(letter){var $selectedItem=$item.filter('.'+className.selected),alreadySelectedLetter=$selectedItem.length>0&&module.has.firstLetter($selectedItem,letter),$nextValue=false,$nextItem;// check next of same letter
if(alreadySelectedLetter){$nextItem=$selectedItem.nextAll($item).eq(0);if(module.has.firstLetter($nextItem,letter)){$nextValue=$nextItem;}}// check all values
if(!$nextValue){$item.each(function(){if(module.has.firstLetter($(this),letter)){$nextValue=$(this);return false;}});}// set next value
if($nextValue){module.verbose('Scrolling to next value with letter',letter);module.set.scrollPosition($nextValue);$selectedItem.removeClass(className.selected);$nextValue.addClass(className.selected);if(settings.selectOnKeydown&&module.is.single()){module.set.selectedItem($nextValue);}}},direction:function direction($menu){if(settings.direction=='auto'){// reset position
module.remove.upward();if(module.can.openDownward($menu)){module.remove.upward($menu);}else{module.set.upward($menu);}if(!module.is.leftward($menu)&&!module.can.openRightward($menu)){module.set.leftward($menu);}}else if(settings.direction=='upward'){module.set.upward($menu);}},upward:function upward($currentMenu){var $element=$currentMenu||$module;$element.addClass(className.upward);},leftward:function leftward($currentMenu){var $element=$currentMenu||$menu;$element.addClass(className.leftward);},value:function value(_value2,text,$selected){var escapedValue=module.escape.value(_value2),hasInput=$input.length>0,isAddition=!module.has.value(_value2),currentValue=module.get.values(),stringValue=_value2!==undefined?String(_value2):_value2,newValue;if(hasInput){if(!settings.allowReselection&&stringValue==currentValue){module.verbose('Skipping value update already same value',_value2,currentValue);if(!module.is.initialLoad()){return;}}if(module.is.single()&&module.has.selectInput()&&module.can.extendSelect()){module.debug('Adding user option',_value2);module.add.optionValue(_value2);}module.debug('Updating input value',escapedValue,currentValue);internalChange=true;$input.val(escapedValue);if(settings.fireOnInit===false&&module.is.initialLoad()){module.debug('Input native change event ignored on initial load');}else{module.trigger.change();}internalChange=false;}else{module.verbose('Storing value in metadata',escapedValue,$input);if(escapedValue!==currentValue){$module.data(metadata.value,stringValue);}}if(settings.fireOnInit===false&&module.is.initialLoad()){module.verbose('No callback on initial load',settings.onChange);}else{settings.onChange.call(element,_value2,text,$selected);}},active:function active(){$module.addClass(className.active);},multiple:function multiple(){$module.addClass(className.multiple);},visible:function visible(){$module.addClass(className.visible);},exactly:function exactly(value,$selectedItem){module.debug('Setting selected to exact values');module.clear();module.set.selected(value,$selectedItem);},selected:function selected(value,$selectedItem){var isMultiple=module.is.multiple(),$userSelectedItem;$selectedItem=settings.allowAdditions?$selectedItem||module.get.itemWithAdditions(value):$selectedItem||module.get.item(value);if(!$selectedItem){return;}module.debug('Setting selected menu item to',$selectedItem);if(module.is.multiple()){module.remove.searchWidth();}if(module.is.single()){module.remove.activeItem();module.remove.selectedItem();}else if(settings.useLabels){module.remove.selectedItem();}// select each item
$selectedItem.each(function(){var $selected=$(this),selectedText=module.get.choiceText($selected),selectedValue=module.get.choiceValue($selected,selectedText),isFiltered=$selected.hasClass(className.filtered),isActive=$selected.hasClass(className.active),isUserValue=$selected.hasClass(className.addition),shouldAnimate=isMultiple&&$selectedItem.length==1;if(isMultiple){if(!isActive||isUserValue){if(settings.apiSettings&&settings.saveRemoteData){module.save.remoteData(selectedText,selectedValue);}if(settings.useLabels){module.add.value(selectedValue,selectedText,$selected);module.add.label(selectedValue,selectedText,shouldAnimate);module.set.activeItem($selected);module.filterActive();module.select.nextAvailable($selectedItem);}else{module.add.value(selectedValue,selectedText,$selected);module.set.text(module.add.variables(message.count));module.set.activeItem($selected);}}else if(!isFiltered){module.debug('Selected active value, removing label');module.remove.selected(selectedValue);}}else{if(settings.apiSettings&&settings.saveRemoteData){module.save.remoteData(selectedText,selectedValue);}module.set.text(selectedText);module.set.value(selectedValue,selectedText,$selected);$selected.addClass(className.active).addClass(className.selected);}});}},add:{label:function label(value,text,shouldAnimate){var $next=module.is.searchSelection()?$search:$text,escapedValue=module.escape.value(value),$label;$label=$('<a />').addClass(className.label).attr('data-'+metadata.value,escapedValue).html(templates.label(escapedValue,text));$label=settings.onLabelCreate.call($label,escapedValue,text);if(module.has.label(value)){module.debug('Label already exists, skipping',escapedValue);return;}if(settings.label.variation){$label.addClass(settings.label.variation);}if(shouldAnimate===true){module.debug('Animating in label',$label);$label.addClass(className.hidden).insertBefore($next).transition(settings.label.transition,settings.label.duration);}else{module.debug('Adding selection label',$label);$label.insertBefore($next);}},message:function message(_message){var $message=$menu.children(selector.message),html=settings.templates.message(module.add.variables(_message));if($message.length>0){$message.html(html);}else{$message=$('<div/>').html(html).addClass(className.message).appendTo($menu);}},optionValue:function optionValue(value){var escapedValue=module.escape.value(value),$option=$input.find('option[value="'+module.escape.string(escapedValue)+'"]'),hasOption=$option.length>0;if(hasOption){return;}// temporarily disconnect observer
module.disconnect.selectObserver();if(module.is.single()){module.verbose('Removing previous user addition');$input.find('option.'+className.addition).remove();}$('<option/>').prop('value',escapedValue).addClass(className.addition).html(value).appendTo($input);module.verbose('Adding user addition as an <option>',value);module.observe.select();},userSuggestion:function userSuggestion(value){var $addition=$menu.children(selector.addition),$existingItem=module.get.item(value),alreadyHasValue=$existingItem&&$existingItem.not(selector.addition).length,hasUserSuggestion=$addition.length>0,html;if(settings.useLabels&&module.has.maxSelections()){return;}if(value===''||alreadyHasValue){$addition.remove();return;}if(hasUserSuggestion){$addition.data(metadata.value,value).data(metadata.text,value).attr('data-'+metadata.value,value).attr('data-'+metadata.text,value).removeClass(className.filtered);if(!settings.hideAdditions){html=settings.templates.addition(module.add.variables(message.addResult,value));$addition.html(html);}module.verbose('Replacing user suggestion with new value',$addition);}else{$addition=module.create.userChoice(value);$addition.prependTo($menu);module.verbose('Adding item choice to menu corresponding with user choice addition',$addition);}if(!settings.hideAdditions||module.is.allFiltered()){$addition.addClass(className.selected).siblings().removeClass(className.selected);}module.refreshItems();},variables:function variables(message,term){var hasCount=message.search('{count}')!==-1,hasMaxCount=message.search('{maxCount}')!==-1,hasTerm=message.search('{term}')!==-1,values,count,query;module.verbose('Adding templated variables to message',message);if(hasCount){count=module.get.selectionCount();message=message.replace('{count}',count);}if(hasMaxCount){count=module.get.selectionCount();message=message.replace('{maxCount}',settings.maxSelections);}if(hasTerm){query=term||module.get.query();message=message.replace('{term}',query);}return message;},value:function value(addedValue,addedText,$selectedItem){var currentValue=module.get.values(),newValue;if(addedValue===''){module.debug('Cannot select blank values from multiselect');return;}// extend current array
if($.isArray(currentValue)){newValue=currentValue.concat([addedValue]);newValue=module.get.uniqueArray(newValue);}else{newValue=[addedValue];}// add values
if(module.has.selectInput()){if(module.can.extendSelect()){module.debug('Adding value to select',addedValue,newValue,$input);module.add.optionValue(addedValue);}}else{newValue=newValue.join(settings.delimiter);module.debug('Setting hidden input to delimited value',newValue,$input);}if(settings.fireOnInit===false&&module.is.initialLoad()){module.verbose('Skipping onadd callback on initial load',settings.onAdd);}else{settings.onAdd.call(element,addedValue,addedText,$selectedItem);}module.set.value(newValue,addedValue,addedText,$selectedItem);module.check.maxSelections();}},remove:{active:function active(){$module.removeClass(className.active);},activeLabel:function activeLabel(){$module.find(selector.label).removeClass(className.active);},empty:function empty(){$module.removeClass(className.empty);},loading:function loading(){$module.removeClass(className.loading);},initialLoad:function initialLoad(){_initialLoad2=false;},upward:function upward($currentMenu){var $element=$currentMenu||$module;$element.removeClass(className.upward);},leftward:function leftward($currentMenu){var $element=$currentMenu||$menu;$element.removeClass(className.leftward);},visible:function visible(){$module.removeClass(className.visible);},activeItem:function activeItem(){$item.removeClass(className.active);},filteredItem:function filteredItem(){if(settings.useLabels&&module.has.maxSelections()){return;}if(settings.useLabels&&module.is.multiple()){$item.not('.'+className.active).removeClass(className.filtered);}else{$item.removeClass(className.filtered);}module.remove.empty();},optionValue:function optionValue(value){var escapedValue=module.escape.value(value),$option=$input.find('option[value="'+module.escape.string(escapedValue)+'"]'),hasOption=$option.length>0;if(!hasOption||!$option.hasClass(className.addition)){return;}// temporarily disconnect observer
if(_selectObserver){_selectObserver.disconnect();module.verbose('Temporarily disconnecting mutation observer');}$option.remove();module.verbose('Removing user addition as an <option>',escapedValue);if(_selectObserver){_selectObserver.observe($input[0],{childList:true,subtree:true});}},message:function message(){$menu.children(selector.message).remove();},searchWidth:function searchWidth(){$search.css('width','');},searchTerm:function searchTerm(){module.verbose('Cleared search term');$search.val('');module.set.filtered();},userAddition:function userAddition(){$item.filter(selector.addition).remove();},selected:function selected(value,$selectedItem){$selectedItem=settings.allowAdditions?$selectedItem||module.get.itemWithAdditions(value):$selectedItem||module.get.item(value);if(!$selectedItem){return false;}$selectedItem.each(function(){var $selected=$(this),selectedText=module.get.choiceText($selected),selectedValue=module.get.choiceValue($selected,selectedText);if(module.is.multiple()){if(settings.useLabels){module.remove.value(selectedValue,selectedText,$selected);module.remove.label(selectedValue);}else{module.remove.value(selectedValue,selectedText,$selected);if(module.get.selectionCount()===0){module.set.placeholderText();}else{module.set.text(module.add.variables(message.count));}}}else{module.remove.value(selectedValue,selectedText,$selected);}$selected.removeClass(className.filtered).removeClass(className.active);if(settings.useLabels){$selected.removeClass(className.selected);}});},selectedItem:function selectedItem(){$item.removeClass(className.selected);},value:function value(removedValue,removedText,$removedItem){var values=module.get.values(),newValue;if(module.has.selectInput()){module.verbose('Input is <select> removing selected option',removedValue);newValue=module.remove.arrayValue(removedValue,values);module.remove.optionValue(removedValue);}else{module.verbose('Removing from delimited values',removedValue);newValue=module.remove.arrayValue(removedValue,values);newValue=newValue.join(settings.delimiter);}if(settings.fireOnInit===false&&module.is.initialLoad()){module.verbose('No callback on initial load',settings.onRemove);}else{settings.onRemove.call(element,removedValue,removedText,$removedItem);}module.set.value(newValue,removedText,$removedItem);module.check.maxSelections();},arrayValue:function arrayValue(removedValue,values){if(!$.isArray(values)){values=[values];}values=$.grep(values,function(value){return removedValue!=value;});module.verbose('Removed value from delimited string',removedValue,values);return values;},label:function label(value,shouldAnimate){var $labels=$module.find(selector.label),$removedLabel=$labels.filter('[data-'+metadata.value+'="'+module.escape.string(value)+'"]');module.verbose('Removing label',$removedLabel);$removedLabel.remove();},activeLabels:function activeLabels($activeLabels){$activeLabels=$activeLabels||$module.find(selector.label).filter('.'+className.active);module.verbose('Removing active label selections',$activeLabels);module.remove.labels($activeLabels);},labels:function labels($labels){$labels=$labels||$module.find(selector.label);module.verbose('Removing labels',$labels);$labels.each(function(){var $label=$(this),value=$label.data(metadata.value),stringValue=value!==undefined?String(value):value,isUserValue=module.is.userValue(stringValue);if(settings.onLabelRemove.call($label,value)===false){module.debug('Label remove callback cancelled removal');return;}module.remove.message();if(isUserValue){module.remove.value(stringValue);module.remove.label(stringValue);}else{// selected will also remove label
module.remove.selected(stringValue);}});},tabbable:function tabbable(){if(module.is.searchSelection()){module.debug('Searchable dropdown initialized');$search.removeAttr('tabindex');$menu.removeAttr('tabindex');}else{module.debug('Simple selection dropdown initialized');$module.removeAttr('tabindex');$menu.removeAttr('tabindex');}}},has:{menuSearch:function menuSearch(){return module.has.search()&&$search.closest($menu).length>0;},search:function search(){return $search.length>0;},sizer:function sizer(){return $sizer.length>0;},selectInput:function selectInput(){return $input.is('select');},minCharacters:function minCharacters(searchTerm){if(settings.minCharacters){searchTerm=searchTerm!==undefined?String(searchTerm):String(module.get.query());return searchTerm.length>=settings.minCharacters;}return true;},firstLetter:function firstLetter($item,letter){var text,firstLetter;if(!$item||$item.length===0||typeof letter!=='string'){return false;}text=module.get.choiceText($item,false);letter=letter.toLowerCase();firstLetter=String(text).charAt(0).toLowerCase();return letter==firstLetter;},input:function input(){return $input.length>0;},items:function items(){return $item.length>0;},menu:function menu(){return $menu.length>0;},message:function message(){return $menu.children(selector.message).length!==0;},label:function label(value){var escapedValue=module.escape.value(value),$labels=$module.find(selector.label);return $labels.filter('[data-'+metadata.value+'="'+module.escape.string(escapedValue)+'"]').length>0;},maxSelections:function maxSelections(){return settings.maxSelections&&module.get.selectionCount()>=settings.maxSelections;},allResultsFiltered:function allResultsFiltered(){var $normalResults=$item.not(selector.addition);return $normalResults.filter(selector.unselectable).length===$normalResults.length;},userSuggestion:function userSuggestion(){return $menu.children(selector.addition).length>0;},query:function query(){return module.get.query()!=='';},value:function value(_value3){var values=module.get.values(),hasValue=$.isArray(values)?values&&$.inArray(_value3,values)!==-1:values==_value3;return hasValue?true:false;}},is:{active:function active(){return $module.hasClass(className.active);},bubbledLabelClick:function bubbledLabelClick(event){return $(event.target).is('select, input')&&$module.closest('label').length>0;},bubbledIconClick:function bubbledIconClick(event){return $(event.target).closest($icon).length>0;},alreadySetup:function alreadySetup(){return $module.is('select')&&$module.parent(selector.dropdown).length>0&&$module.prev().length===0;},animating:function animating($subMenu){return $subMenu?$subMenu.transition&&$subMenu.transition('is animating'):$menu.transition&&$menu.transition('is animating');},leftward:function leftward($subMenu){var $selectedMenu=$subMenu||$menu;return $selectedMenu.hasClass(className.leftward);},disabled:function disabled(){return $module.hasClass(className.disabled);},focused:function focused(){return document.activeElement===$module[0];},focusedOnSearch:function focusedOnSearch(){return document.activeElement===$search[0];},allFiltered:function allFiltered(){return(module.is.multiple()||module.has.search())&&!(settings.hideAdditions==false&&module.has.userSuggestion())&&!module.has.message()&&module.has.allResultsFiltered();},hidden:function hidden($subMenu){return!module.is.visible($subMenu);},initialLoad:function initialLoad(){return _initialLoad2;},inObject:function inObject(needle,object){var found=false;$.each(object,function(index,property){if(property==needle){found=true;return true;}});return found;},multiple:function multiple(){return $module.hasClass(className.multiple);},remote:function remote(){return settings.apiSettings&&module.can.useAPI();},single:function single(){return!module.is.multiple();},selectMutation:function selectMutation(mutations){var selectChanged=false;$.each(mutations,function(index,mutation){if(mutation.target&&$(mutation.target).is('select')){selectChanged=true;return true;}});return selectChanged;},search:function search(){return $module.hasClass(className.search);},searchSelection:function searchSelection(){return module.has.search()&&$search.parent(selector.dropdown).length===1;},selection:function selection(){return $module.hasClass(className.selection);},userValue:function userValue(value){return $.inArray(value,module.get.userValues())!==-1;},upward:function upward($menu){var $element=$menu||$module;return $element.hasClass(className.upward);},visible:function visible($subMenu){return $subMenu?$subMenu.hasClass(className.visible):$menu.hasClass(className.visible);},verticallyScrollableContext:function verticallyScrollableContext(){var overflowY=$context.get(0)!==window?$context.css('overflow-y'):false;return overflowY=='auto'||overflowY=='scroll';},horizontallyScrollableContext:function horizontallyScrollableContext(){var overflowX=$context.get(0)!==window?$context.css('overflow-X'):false;return overflowX=='auto'||overflowX=='scroll';}},can:{activate:function activate($item){if(settings.useLabels){return true;}if(!module.has.maxSelections()){return true;}if(module.has.maxSelections()&&$item.hasClass(className.active)){return true;}return false;},openDownward:function openDownward($subMenu){var $currentMenu=$subMenu||$menu,canOpenDownward=true,onScreen={},calculations;$currentMenu.addClass(className.loading);calculations={context:{scrollTop:$context.scrollTop(),height:$context.outerHeight()},menu:{offset:$currentMenu.offset(),height:$currentMenu.outerHeight()}};if(module.is.verticallyScrollableContext()){calculations.menu.offset.top+=calculations.context.scrollTop;}onScreen={above:calculations.context.scrollTop<=calculations.menu.offset.top-calculations.menu.height,below:calculations.context.scrollTop+calculations.context.height>=calculations.menu.offset.top+calculations.menu.height};if(onScreen.below){module.verbose('Dropdown can fit in context downward',onScreen);canOpenDownward=true;}else if(!onScreen.below&&!onScreen.above){module.verbose('Dropdown cannot fit in either direction, favoring downward',onScreen);canOpenDownward=true;}else{module.verbose('Dropdown cannot fit below, opening upward',onScreen);canOpenDownward=false;}$currentMenu.removeClass(className.loading);return canOpenDownward;},openRightward:function openRightward($subMenu){var $currentMenu=$subMenu||$menu,canOpenRightward=true,isOffscreenRight=false,calculations;$currentMenu.addClass(className.loading);calculations={context:{scrollLeft:$context.scrollLeft(),width:$context.outerWidth()},menu:{offset:$currentMenu.offset(),width:$currentMenu.outerWidth()}};if(module.is.horizontallyScrollableContext()){calculations.menu.offset.left+=calculations.context.scrollLeft;}isOffscreenRight=calculations.menu.offset.left+calculations.menu.width>=calculations.context.scrollLeft+calculations.context.width;if(isOffscreenRight){module.verbose('Dropdown cannot fit in context rightward',isOffscreenRight);canOpenRightward=false;}$currentMenu.removeClass(className.loading);return canOpenRightward;},click:function click(){return hasTouch||settings.on=='click';},extendSelect:function extendSelect(){return settings.allowAdditions||settings.apiSettings;},show:function show(){return!module.is.disabled()&&(module.has.items()||module.has.message());},useAPI:function useAPI(){return $.fn.api!==undefined;}},animate:{show:function show(callback,$subMenu){var $currentMenu=$subMenu||$menu,start=$subMenu?function(){}:function(){module.hideSubMenus();module.hideOthers();module.set.active();},transition;callback=$.isFunction(callback)?callback:function(){};module.verbose('Doing menu show animation',$currentMenu);module.set.direction($subMenu);transition=module.get.transition($subMenu);if(module.is.selection()){module.set.scrollPosition(module.get.selectedItem(),true);}if(module.is.hidden($currentMenu)||module.is.animating($currentMenu)){if(transition=='none'){start();$currentMenu.transition('show');callback.call(element);}else if($.fn.transition!==undefined&&$module.transition('is supported')){$currentMenu.transition({animation:transition+' in',debug:settings.debug,verbose:settings.verbose,duration:settings.duration,queue:true,onStart:start,onComplete:function onComplete(){callback.call(element);}});}else{module.error(error.noTransition,transition);}}},hide:function hide(callback,$subMenu){var $currentMenu=$subMenu||$menu,duration=$subMenu?settings.duration*0.9:settings.duration,start=$subMenu?function(){}:function(){if(module.can.click()){module.unbind.intent();}module.remove.active();},transition=module.get.transition($subMenu);callback=$.isFunction(callback)?callback:function(){};if(module.is.visible($currentMenu)||module.is.animating($currentMenu)){module.verbose('Doing menu hide animation',$currentMenu);if(transition=='none'){start();$currentMenu.transition('hide');callback.call(element);}else if($.fn.transition!==undefined&&$module.transition('is supported')){$currentMenu.transition({animation:transition+' out',duration:settings.duration,debug:settings.debug,verbose:settings.verbose,queue:true,onStart:start,onComplete:function onComplete(){callback.call(element);}});}else{module.error(error.transition);}}}},hideAndClear:function hideAndClear(){module.remove.searchTerm();if(module.has.maxSelections()){return;}if(module.has.search()){module.hide(function(){module.remove.filteredItem();});}else{module.hide();}},delay:{show:function show(){module.verbose('Delaying show event to ensure user intent');clearTimeout(module.timer);module.timer=setTimeout(module.show,settings.delay.show);},hide:function hide(){module.verbose('Delaying hide event to ensure user intent');clearTimeout(module.timer);module.timer=setTimeout(module.hide,settings.delay.hide);}},escape:{value:function value(_value4){var multipleValues=$.isArray(_value4),stringValue=typeof _value4==='string',isUnparsable=!stringValue&&!multipleValues,hasQuotes=stringValue&&_value4.search(regExp.quote)!==-1,values=[];if(isUnparsable||!hasQuotes){return _value4;}module.debug('Encoding quote values for use in select',_value4);if(multipleValues){$.each(_value4,function(index,value){values.push(value.replace(regExp.quote,'&quot;'));});return values;}return _value4.replace(regExp.quote,'&quot;');},string:function string(text){text=String(text);return text.replace(regExp.escape,'\\$&');}},setting:function setting(name,value){module.debug('Changing setting',name,value);if($.isPlainObject(name)){$.extend(true,settings,name);}else if(value!==undefined){if($.isPlainObject(settings[name])){$.extend(true,settings[name],value);}else{settings[name]=value;}}else{return settings[name];}},internal:function internal(name,value){if($.isPlainObject(name)){$.extend(true,module,name);}else if(value!==undefined){module[name]=value;}else{return module[name];}},debug:function debug(){if(!settings.silent&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.debug=Function.prototype.bind.call(console.info,console,settings.name+':');module.debug.apply(console,arguments);}}},verbose:function verbose(){if(!settings.silent&&settings.verbose&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.verbose=Function.prototype.bind.call(console.info,console,settings.name+':');module.verbose.apply(console,arguments);}}},error:function error(){if(!settings.silent){module.error=Function.prototype.bind.call(console.error,console,settings.name+':');module.error.apply(console,arguments);}},performance:{log:function log(message){var currentTime,executionTime,previousTime;if(settings.performance){currentTime=new Date().getTime();previousTime=time||currentTime;executionTime=currentTime-previousTime;time=currentTime;performance.push({'Name':message[0],'Arguments':[].slice.call(message,1)||'','Element':element,'Execution Time':executionTime});}clearTimeout(module.performance.timer);module.performance.timer=setTimeout(module.performance.display,500);},display:function display(){var title=settings.name+':',totalTime=0;time=false;clearTimeout(module.performance.timer);$.each(performance,function(index,data){totalTime+=data['Execution Time'];});title+=' '+totalTime+'ms';if(moduleSelector){title+=' \''+moduleSelector+'\'';}if((console.group!==undefined||console.table!==undefined)&&performance.length>0){console.groupCollapsed(title);if(console.table){console.table(performance);}else{$.each(performance,function(index,data){console.log(data['Name']+': '+data['Execution Time']+'ms');});}console.groupEnd();}performance=[];}},invoke:function invoke(query,passedArguments,context){var object=instance,maxDepth,found,response;passedArguments=passedArguments||queryArguments;context=element||context;if(typeof query=='string'&&object!==undefined){query=query.split(/[\. ]/);maxDepth=query.length-1;$.each(query,function(depth,value){var camelCaseValue=depth!=maxDepth?value+query[depth+1].charAt(0).toUpperCase()+query[depth+1].slice(1):query;if($.isPlainObject(object[camelCaseValue])&&depth!=maxDepth){object=object[camelCaseValue];}else if(object[camelCaseValue]!==undefined){found=object[camelCaseValue];return false;}else if($.isPlainObject(object[value])&&depth!=maxDepth){object=object[value];}else if(object[value]!==undefined){found=object[value];return false;}else{module.error(error.method,query);return false;}});}if($.isFunction(found)){response=found.apply(context,passedArguments);}else if(found!==undefined){response=found;}if($.isArray(returnedValue)){returnedValue.push(response);}else if(returnedValue!==undefined){returnedValue=[returnedValue,response];}else if(response!==undefined){returnedValue=response;}return found;}};if(methodInvoked){if(instance===undefined){module.initialize();}module.invoke(query);}else{if(instance!==undefined){instance.invoke('destroy');}module.initialize();}});return returnedValue!==undefined?returnedValue:$allModules;};$.fn.dropdown.settings={silent:false,debug:false,verbose:false,performance:true,on:'click',// what event should show menu action on item selection
action:'activate',// action on item selection (nothing, activate, select, combo, hide, function(){})
apiSettings:false,selectOnKeydown:true,// Whether selection should occur automatically when keyboard shortcuts used
minCharacters:0,// Minimum characters required to trigger API call
filterRemoteData:false,// Whether API results should be filtered after being returned for query term
saveRemoteData:true,// Whether remote name/value pairs should be stored in sessionStorage to allow remote data to be restored on page refresh
throttle:200,// How long to wait after last user input to search remotely
context:window,// Context to use when determining if on screen
direction:'auto',// Whether dropdown should always open in one direction
keepOnScreen:true,// Whether dropdown should check whether it is on screen before showing
match:'both',// what to match against with search selection (both, text, or label)
fullTextSearch:false,// search anywhere in value (set to 'exact' to require exact matches)
placeholder:'auto',// whether to convert blank <select> values to placeholder text
preserveHTML:true,// preserve html when selecting value
sortSelect:false,// sort selection on init
forceSelection:true,// force a choice on blur with search selection
allowAdditions:false,// whether multiple select should allow user added values
hideAdditions:true,// whether or not to hide special message prompting a user they can enter a value
maxSelections:false,// When set to a number limits the number of selections to this count
useLabels:true,// whether multiple select should filter currently active selections from choices
delimiter:',',// when multiselect uses normal <input> the values will be delimited with this character
showOnFocus:true,// show menu on focus
allowReselection:false,// whether current value should trigger callbacks when reselected
allowTab:true,// add tabindex to element
allowCategorySelection:false,// allow elements with sub-menus to be selected
fireOnInit:false,// Whether callbacks should fire when initializing dropdown values
transition:'auto',// auto transition will slide down or up based on direction
duration:200,// duration of transition
glyphWidth:1.037,// widest glyph width in em (W is 1.037 em) used to calculate multiselect input width
// label settings on multi-select
label:{transition:'scale',duration:200,variation:false},// delay before event
delay:{hide:300,show:200,search:20,touch:50},/* Callbacks */onChange:function onChange(value,text,$selected){},onAdd:function onAdd(value,text,$selected){},onRemove:function onRemove(value,text,$selected){},onLabelSelect:function onLabelSelect($selectedLabels){},onLabelCreate:function onLabelCreate(value,text){return $(this);},onLabelRemove:function onLabelRemove(value){return true;},onNoResults:function onNoResults(searchTerm){return true;},onShow:function onShow(){},onHide:function onHide(){},/* Component */name:'Dropdown',namespace:'dropdown',message:{addResult:'Add <b>{term}</b>',count:'{count} selected',maxSelections:'Max {maxCount} selections',noResults:'No results found.',serverError:'There was an error contacting the server'},error:{action:'You called a dropdown action that was not defined',alreadySetup:'Once a select has been initialized behaviors must be called on the created ui dropdown',labels:'Allowing user additions currently requires the use of labels.',missingMultiple:'<select> requires multiple property to be set to correctly preserve multiple values',method:'The method you called is not defined.',noAPI:'The API module is required to load resources remotely',noStorage:'Saving remote data requires session storage',noTransition:'This module requires ui transitions <https://github.com/Semantic-Org/UI-Transition>'},regExp:{escape:/[-[\]{}()*+?.,\\^$|#\s]/g,quote:/"/g},metadata:{defaultText:'defaultText',defaultValue:'defaultValue',placeholderText:'placeholder',text:'text',value:'value'},// property names for remote query
fields:{remoteValues:'results',// grouping for api results
values:'values',// grouping for all dropdown values
disabled:'disabled',// whether value should be disabled
name:'name',// displayed dropdown text
value:'value',// actual dropdown value
text:'text'// displayed text when selected
},keys:{backspace:8,delimiter:188,// comma
deleteKey:46,enter:13,escape:27,pageUp:33,pageDown:34,leftArrow:37,upArrow:38,rightArrow:39,downArrow:40},selector:{addition:'.addition',dropdown:'.ui.dropdown',hidden:'.hidden',icon:'> .dropdown.icon',input:'> input[type="hidden"], > select',item:'.item',label:'> .label',remove:'> .label > .delete.icon',siblingLabel:'.label',menu:'.menu',message:'.message',menuIcon:'.dropdown.icon',search:'input.search, .menu > .search > input, .menu input.search',sizer:'> input.sizer',text:'> .text:not(.icon)',unselectable:'.disabled, .filtered'},className:{active:'active',addition:'addition',animating:'animating',disabled:'disabled',empty:'empty',dropdown:'ui dropdown',filtered:'filtered',hidden:'hidden transition',item:'item',label:'ui label',loading:'loading',menu:'menu',message:'message',multiple:'multiple',placeholder:'default',sizer:'sizer',search:'search',selected:'selected',selection:'selection',upward:'upward',leftward:'left',visible:'visible'}};/* Templates */$.fn.dropdown.settings.templates={// generates dropdown from select values
dropdown:function dropdown(select){var placeholder=select.placeholder||false,values=select.values||{},html='';html+='<i class="dropdown icon"></i>';if(select.placeholder){html+='<div class="default text">'+placeholder+'</div>';}else{html+='<div class="text"></div>';}html+='<div class="menu">';$.each(select.values,function(index,option){html+=option.disabled?'<div class="disabled item" data-value="'+option.value+'">'+option.name+'</div>':'<div class="item" data-value="'+option.value+'">'+option.name+'</div>';});html+='</div>';return html;},// generates just menu from select
menu:function menu(response,fields){var values=response[fields.values]||{},html='';$.each(values,function(index,option){var maybeText=option[fields.text]?'data-text="'+option[fields.text]+'"':'',maybeDisabled=option[fields.disabled]?'disabled ':'';html+='<div class="'+maybeDisabled+'item" data-value="'+option[fields.value]+'"'+maybeText+'>';html+=option[fields.name];html+='</div>';});return html;},// generates label for multiselect
label:function label(value,text){return text+'<i class="delete icon"></i>';},// generates messages like "No results"
message:function message(_message2){return _message2;},// generates user addition to selection menu
addition:function addition(choice){return choice;}};})(jQuery,window,document);/*!
 * # Semantic UI 2.2.11 - Embed
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */;(function($,window,document,undefined){"use strict";window=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();$.fn.embed=function(parameters){var $allModules=$(this),moduleSelector=$allModules.selector||'',time=new Date().getTime(),performance=[],query=arguments[0],methodInvoked=typeof query=='string',queryArguments=[].slice.call(arguments,1),returnedValue;$allModules.each(function(){var settings=$.isPlainObject(parameters)?$.extend(true,{},$.fn.embed.settings,parameters):$.extend({},$.fn.embed.settings),selector=settings.selector,className=settings.className,sources=settings.sources,error=settings.error,metadata=settings.metadata,namespace=settings.namespace,templates=settings.templates,eventNamespace='.'+namespace,moduleNamespace='module-'+namespace,$window=$(window),$module=$(this),$placeholder=$module.find(selector.placeholder),$icon=$module.find(selector.icon),$embed=$module.find(selector.embed),element=this,instance=$module.data(moduleNamespace),module;module={initialize:function initialize(){module.debug('Initializing embed');module.determine.autoplay();module.create();module.bind.events();module.instantiate();},instantiate:function instantiate(){module.verbose('Storing instance of module',module);instance=module;$module.data(moduleNamespace,module);},destroy:function destroy(){module.verbose('Destroying previous instance of embed');module.reset();$module.removeData(moduleNamespace).off(eventNamespace);},refresh:function refresh(){module.verbose('Refreshing selector cache');$placeholder=$module.find(selector.placeholder);$icon=$module.find(selector.icon);$embed=$module.find(selector.embed);},bind:{events:function events(){if(module.has.placeholder()){module.debug('Adding placeholder events');$module.on('click'+eventNamespace,selector.placeholder,module.createAndShow).on('click'+eventNamespace,selector.icon,module.createAndShow);}}},create:function create(){var placeholder=module.get.placeholder();if(placeholder){module.createPlaceholder();}else{module.createAndShow();}},createPlaceholder:function createPlaceholder(placeholder){var icon=module.get.icon(),url=module.get.url(),embed=module.generate.embed(url);placeholder=placeholder||module.get.placeholder();$module.html(templates.placeholder(placeholder,icon));module.debug('Creating placeholder for embed',placeholder,icon);},createEmbed:function createEmbed(url){module.refresh();url=url||module.get.url();$embed=$('<div/>').addClass(className.embed).html(module.generate.embed(url)).appendTo($module);settings.onCreate.call(element,url);module.debug('Creating embed object',$embed);},changeEmbed:function changeEmbed(url){$embed.html(module.generate.embed(url));},createAndShow:function createAndShow(){module.createEmbed();module.show();},// sets new embed
change:function change(source,id,url){module.debug('Changing video to ',source,id,url);$module.data(metadata.source,source).data(metadata.id,id);if(url){$module.data(metadata.url,url);}else{$module.removeData(metadata.url);}if(module.has.embed()){module.changeEmbed();}else{module.create();}},// clears embed
reset:function reset(){module.debug('Clearing embed and showing placeholder');module.remove.active();module.remove.embed();module.showPlaceholder();settings.onReset.call(element);},// shows current embed
show:function show(){module.debug('Showing embed');module.set.active();settings.onDisplay.call(element);},hide:function hide(){module.debug('Hiding embed');module.showPlaceholder();},showPlaceholder:function showPlaceholder(){module.debug('Showing placeholder image');module.remove.active();settings.onPlaceholderDisplay.call(element);},get:{id:function id(){return settings.id||$module.data(metadata.id);},placeholder:function placeholder(){return settings.placeholder||$module.data(metadata.placeholder);},icon:function icon(){return settings.icon?settings.icon:$module.data(metadata.icon)!==undefined?$module.data(metadata.icon):module.determine.icon();},source:function source(url){return settings.source?settings.source:$module.data(metadata.source)!==undefined?$module.data(metadata.source):module.determine.source();},type:function type(){var source=module.get.source();return sources[source]!==undefined?sources[source].type:false;},url:function url(){return settings.url?settings.url:$module.data(metadata.url)!==undefined?$module.data(metadata.url):module.determine.url();}},determine:{autoplay:function autoplay(){if(module.should.autoplay()){settings.autoplay=true;}},source:function source(url){var matchedSource=false;url=url||module.get.url();if(url){$.each(sources,function(name,source){if(url.search(source.domain)!==-1){matchedSource=name;return false;}});}return matchedSource;},icon:function icon(){var source=module.get.source();return sources[source]!==undefined?sources[source].icon:false;},url:function url(){var id=settings.id||$module.data(metadata.id),source=settings.source||$module.data(metadata.source),url;url=sources[source]!==undefined?sources[source].url.replace('{id}',id):false;if(url){$module.data(metadata.url,url);}return url;}},set:{active:function active(){$module.addClass(className.active);}},remove:{active:function active(){$module.removeClass(className.active);},embed:function embed(){$embed.empty();}},encode:{parameters:function parameters(_parameters){var urlString=[],index;for(index in _parameters){urlString.push(encodeURIComponent(index)+'='+encodeURIComponent(_parameters[index]));}return urlString.join('&amp;');}},generate:{embed:function embed(url){module.debug('Generating embed html');var source=module.get.source(),html,parameters;url=module.get.url(url);if(url){parameters=module.generate.parameters(source);html=templates.iframe(url,parameters);}else{module.error(error.noURL,$module);}return html;},parameters:function parameters(source,extraParameters){var parameters=sources[source]&&sources[source].parameters!==undefined?sources[source].parameters(settings):{};extraParameters=extraParameters||settings.parameters;if(extraParameters){parameters=$.extend({},parameters,extraParameters);}parameters=settings.onEmbed(parameters);return module.encode.parameters(parameters);}},has:{embed:function embed(){return $embed.length>0;},placeholder:function placeholder(){return settings.placeholder||$module.data(metadata.placeholder);}},should:{autoplay:function autoplay(){return settings.autoplay==='auto'?settings.placeholder||$module.data(metadata.placeholder)!==undefined:settings.autoplay;}},is:{video:function video(){return module.get.type()=='video';}},setting:function setting(name,value){module.debug('Changing setting',name,value);if($.isPlainObject(name)){$.extend(true,settings,name);}else if(value!==undefined){if($.isPlainObject(settings[name])){$.extend(true,settings[name],value);}else{settings[name]=value;}}else{return settings[name];}},internal:function internal(name,value){if($.isPlainObject(name)){$.extend(true,module,name);}else if(value!==undefined){module[name]=value;}else{return module[name];}},debug:function debug(){if(!settings.silent&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.debug=Function.prototype.bind.call(console.info,console,settings.name+':');module.debug.apply(console,arguments);}}},verbose:function verbose(){if(!settings.silent&&settings.verbose&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.verbose=Function.prototype.bind.call(console.info,console,settings.name+':');module.verbose.apply(console,arguments);}}},error:function error(){if(!settings.silent){module.error=Function.prototype.bind.call(console.error,console,settings.name+':');module.error.apply(console,arguments);}},performance:{log:function log(message){var currentTime,executionTime,previousTime;if(settings.performance){currentTime=new Date().getTime();previousTime=time||currentTime;executionTime=currentTime-previousTime;time=currentTime;performance.push({'Name':message[0],'Arguments':[].slice.call(message,1)||'','Element':element,'Execution Time':executionTime});}clearTimeout(module.performance.timer);module.performance.timer=setTimeout(module.performance.display,500);},display:function display(){var title=settings.name+':',totalTime=0;time=false;clearTimeout(module.performance.timer);$.each(performance,function(index,data){totalTime+=data['Execution Time'];});title+=' '+totalTime+'ms';if(moduleSelector){title+=' \''+moduleSelector+'\'';}if($allModules.length>1){title+=' '+'('+$allModules.length+')';}if((console.group!==undefined||console.table!==undefined)&&performance.length>0){console.groupCollapsed(title);if(console.table){console.table(performance);}else{$.each(performance,function(index,data){console.log(data['Name']+': '+data['Execution Time']+'ms');});}console.groupEnd();}performance=[];}},invoke:function invoke(query,passedArguments,context){var object=instance,maxDepth,found,response;passedArguments=passedArguments||queryArguments;context=element||context;if(typeof query=='string'&&object!==undefined){query=query.split(/[\. ]/);maxDepth=query.length-1;$.each(query,function(depth,value){var camelCaseValue=depth!=maxDepth?value+query[depth+1].charAt(0).toUpperCase()+query[depth+1].slice(1):query;if($.isPlainObject(object[camelCaseValue])&&depth!=maxDepth){object=object[camelCaseValue];}else if(object[camelCaseValue]!==undefined){found=object[camelCaseValue];return false;}else if($.isPlainObject(object[value])&&depth!=maxDepth){object=object[value];}else if(object[value]!==undefined){found=object[value];return false;}else{module.error(error.method,query);return false;}});}if($.isFunction(found)){response=found.apply(context,passedArguments);}else if(found!==undefined){response=found;}if($.isArray(returnedValue)){returnedValue.push(response);}else if(returnedValue!==undefined){returnedValue=[returnedValue,response];}else if(response!==undefined){returnedValue=response;}return found;}};if(methodInvoked){if(instance===undefined){module.initialize();}module.invoke(query);}else{if(instance!==undefined){instance.invoke('destroy');}module.initialize();}});return returnedValue!==undefined?returnedValue:this;};$.fn.embed.settings={name:'Embed',namespace:'embed',silent:false,debug:false,verbose:false,performance:true,icon:false,source:false,url:false,id:false,// standard video settings
autoplay:'auto',color:'#444444',hd:true,brandedUI:false,// additional parameters to include with the embed
parameters:false,onDisplay:function onDisplay(){},onPlaceholderDisplay:function onPlaceholderDisplay(){},onReset:function onReset(){},onCreate:function onCreate(url){},onEmbed:function onEmbed(parameters){return parameters;},metadata:{id:'id',icon:'icon',placeholder:'placeholder',source:'source',url:'url'},error:{noURL:'No URL specified',method:'The method you called is not defined'},className:{active:'active',embed:'embed'},selector:{embed:'.embed',placeholder:'.placeholder',icon:'.icon'},sources:{youtube:{name:'youtube',type:'video',icon:'video play',domain:'youtube.com',url:'//www.youtube.com/embed/{id}',parameters:function parameters(settings){return{autohide:!settings.brandedUI,autoplay:settings.autoplay,color:settings.color||undefined,hq:settings.hd,jsapi:settings.api,modestbranding:!settings.brandedUI};}},vimeo:{name:'vimeo',type:'video',icon:'video play',domain:'vimeo.com',url:'//player.vimeo.com/video/{id}',parameters:function parameters(settings){return{api:settings.api,autoplay:settings.autoplay,byline:settings.brandedUI,color:settings.color||undefined,portrait:settings.brandedUI,title:settings.brandedUI};}}},templates:{iframe:function iframe(url,parameters){var src=url;if(parameters){src+='?'+parameters;}return''+'<iframe src="'+src+'"'+' width="100%" height="100%"'+' frameborder="0" scrolling="no" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';},placeholder:function placeholder(image,icon){var html='';if(icon){html+='<i class="'+icon+' icon"></i>';}if(image){html+='<img class="placeholder" src="'+image+'">';}return html;}},// NOT YET IMPLEMENTED
api:false,onPause:function onPause(){},onPlay:function onPlay(){},onStop:function onStop(){}};})(jQuery,window,document);/*!
 * # Semantic UI 2.2.11 - Modal
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */;(function($,window,document,undefined){"use strict";window=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();$.fn.modal=function(parameters){var $allModules=$(this),$window=$(window),$document=$(document),$body=$('body'),moduleSelector=$allModules.selector||'',time=new Date().getTime(),performance=[],query=arguments[0],methodInvoked=typeof query=='string',queryArguments=[].slice.call(arguments,1),requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||function(callback){setTimeout(callback,0);},returnedValue;$allModules.each(function(){var settings=$.isPlainObject(parameters)?$.extend(true,{},$.fn.modal.settings,parameters):$.extend({},$.fn.modal.settings),selector=settings.selector,className=settings.className,namespace=settings.namespace,error=settings.error,eventNamespace='.'+namespace,moduleNamespace='module-'+namespace,$module=$(this),$context=$(settings.context),$close=$module.find(selector.close),$allModals,$otherModals,$focusedElement,$dimmable,$dimmer,element=this,instance=$module.data(moduleNamespace),ignoreRepeatedEvents=false,elementEventNamespace,_id2,observer,module;module={initialize:function initialize(){module.verbose('Initializing dimmer',$context);module.create.id();module.create.dimmer();module.refreshModals();module.bind.events();if(settings.observeChanges){module.observeChanges();}module.instantiate();},instantiate:function instantiate(){module.verbose('Storing instance of modal');instance=module;$module.data(moduleNamespace,instance);},create:{dimmer:function dimmer(){var defaultSettings={debug:settings.debug,dimmerName:'modals'},dimmerSettings=$.extend(true,defaultSettings,settings.dimmerSettings);if($.fn.dimmer===undefined){module.error(error.dimmer);return;}module.debug('Creating dimmer');$dimmable=$context.dimmer(dimmerSettings);if(settings.detachable){module.verbose('Modal is detachable, moving content into dimmer');$dimmable.dimmer('add content',$module);}else{module.set.undetached();}$dimmer=$dimmable.dimmer('get dimmer');},id:function id(){_id2=(Math.random().toString(16)+'000000000').substr(2,8);elementEventNamespace='.'+_id2;module.verbose('Creating unique id for element',_id2);}},destroy:function destroy(){module.verbose('Destroying previous modal');$module.removeData(moduleNamespace).off(eventNamespace);$window.off(elementEventNamespace);$dimmer.off(elementEventNamespace);$close.off(eventNamespace);$context.dimmer('destroy');},observeChanges:function observeChanges(){if('MutationObserver'in window){observer=new MutationObserver(function(mutations){module.debug('DOM tree modified, refreshing');module.refresh();});observer.observe(element,{childList:true,subtree:true});module.debug('Setting up mutation observer',observer);}},refresh:function refresh(){module.remove.scrolling();module.cacheSizes();module.set.screenHeight();module.set.type();module.set.position();},refreshModals:function refreshModals(){$otherModals=$module.siblings(selector.modal);$allModals=$otherModals.add($module);},attachEvents:function attachEvents(selector,event){var $toggle=$(selector);event=$.isFunction(module[event])?module[event]:module.toggle;if($toggle.length>0){module.debug('Attaching modal events to element',selector,event);$toggle.off(eventNamespace).on('click'+eventNamespace,event);}else{module.error(error.notFound,selector);}},bind:{events:function events(){module.verbose('Attaching events');$module.on('click'+eventNamespace,selector.close,module.event.close).on('click'+eventNamespace,selector.approve,module.event.approve).on('click'+eventNamespace,selector.deny,module.event.deny);$window.on('resize'+elementEventNamespace,module.event.resize);}},get:{id:function id(){return(Math.random().toString(16)+'000000000').substr(2,8);}},event:{approve:function approve(){if(ignoreRepeatedEvents||settings.onApprove.call(element,$(this))===false){module.verbose('Approve callback returned false cancelling hide');return;}ignoreRepeatedEvents=true;module.hide(function(){ignoreRepeatedEvents=false;});},deny:function deny(){if(ignoreRepeatedEvents||settings.onDeny.call(element,$(this))===false){module.verbose('Deny callback returned false cancelling hide');return;}ignoreRepeatedEvents=true;module.hide(function(){ignoreRepeatedEvents=false;});},close:function close(){module.hide();},click:function click(event){var $target=$(event.target),isInModal=$target.closest(selector.modal).length>0,isInDOM=$.contains(document.documentElement,event.target);if(!isInModal&&isInDOM){module.debug('Dimmer clicked, hiding all modals');if(module.is.active()){module.remove.clickaway();if(settings.allowMultiple){module.hide();}else{module.hideAll();}}}},debounce:function debounce(method,delay){clearTimeout(module.timer);module.timer=setTimeout(method,delay);},keyboard:function keyboard(event){var keyCode=event.which,escapeKey=27;if(keyCode==escapeKey){if(settings.closable){module.debug('Escape key pressed hiding modal');module.hide();}else{module.debug('Escape key pressed, but closable is set to false');}event.preventDefault();}},resize:function resize(){if($dimmable.dimmer('is active')&&(module.is.animating()||module.is.active())){requestAnimationFrame(module.refresh);}}},toggle:function toggle(){if(module.is.active()||module.is.animating()){module.hide();}else{module.show();}},show:function show(callback){callback=$.isFunction(callback)?callback:function(){};module.refreshModals();module.set.dimmerSettings();module.showModal(callback);},hide:function hide(callback){callback=$.isFunction(callback)?callback:function(){};module.refreshModals();module.hideModal(callback);},showModal:function showModal(callback){callback=$.isFunction(callback)?callback:function(){};if(module.is.animating()||!module.is.active()){module.showDimmer();module.cacheSizes();module.set.position();module.set.screenHeight();module.set.type();module.set.clickaway();if(!settings.allowMultiple&&module.others.active()){module.hideOthers(module.showModal);}else{settings.onShow.call(element);if(settings.transition&&$.fn.transition!==undefined&&$module.transition('is supported')){module.debug('Showing modal with css animations');$module.transition({debug:settings.debug,animation:settings.transition+' in',queue:settings.queue,duration:settings.duration,useFailSafe:true,onComplete:function onComplete(){settings.onVisible.apply(element);if(settings.keyboardShortcuts){module.add.keyboardShortcuts();}module.save.focus();module.set.active();if(settings.autofocus){module.set.autofocus();}callback();}});}else{module.error(error.noTransition);}}}else{module.debug('Modal is already visible');}},hideModal:function hideModal(callback,keepDimmed){callback=$.isFunction(callback)?callback:function(){};module.debug('Hiding modal');if(settings.onHide.call(element,$(this))===false){module.verbose('Hide callback returned false cancelling hide');return;}if(module.is.animating()||module.is.active()){if(settings.transition&&$.fn.transition!==undefined&&$module.transition('is supported')){module.remove.active();$module.transition({debug:settings.debug,animation:settings.transition+' out',queue:settings.queue,duration:settings.duration,useFailSafe:true,onStart:function onStart(){if(!module.others.active()&&!keepDimmed){module.hideDimmer();}if(settings.keyboardShortcuts){module.remove.keyboardShortcuts();}},onComplete:function onComplete(){settings.onHidden.call(element);module.restore.focus();callback();}});}else{module.error(error.noTransition);}}},showDimmer:function showDimmer(){if($dimmable.dimmer('is animating')||!$dimmable.dimmer('is active')){module.debug('Showing dimmer');$dimmable.dimmer('show');}else{module.debug('Dimmer already visible');}},hideDimmer:function hideDimmer(){if($dimmable.dimmer('is animating')||$dimmable.dimmer('is active')){$dimmable.dimmer('hide',function(){module.remove.clickaway();module.remove.screenHeight();});}else{module.debug('Dimmer is not visible cannot hide');return;}},hideAll:function hideAll(callback){var $visibleModals=$allModals.filter('.'+className.active+', .'+className.animating);callback=$.isFunction(callback)?callback:function(){};if($visibleModals.length>0){module.debug('Hiding all visible modals');module.hideDimmer();$visibleModals.modal('hide modal',callback);}},hideOthers:function hideOthers(callback){var $visibleModals=$otherModals.filter('.'+className.active+', .'+className.animating);callback=$.isFunction(callback)?callback:function(){};if($visibleModals.length>0){module.debug('Hiding other modals',$otherModals);$visibleModals.modal('hide modal',callback,true);}},others:{active:function active(){return $otherModals.filter('.'+className.active).length>0;},animating:function animating(){return $otherModals.filter('.'+className.animating).length>0;}},add:{keyboardShortcuts:function keyboardShortcuts(){module.verbose('Adding keyboard shortcuts');$document.on('keyup'+eventNamespace,module.event.keyboard);}},save:{focus:function focus(){$focusedElement=$(document.activeElement).blur();}},restore:{focus:function focus(){if($focusedElement&&$focusedElement.length>0){$focusedElement.focus();}}},remove:{active:function active(){$module.removeClass(className.active);},clickaway:function clickaway(){if(settings.closable){$dimmer.off('click'+elementEventNamespace);}},bodyStyle:function bodyStyle(){if($body.attr('style')===''){module.verbose('Removing style attribute');$body.removeAttr('style');}},screenHeight:function screenHeight(){module.debug('Removing page height');$body.css('height','');},keyboardShortcuts:function keyboardShortcuts(){module.verbose('Removing keyboard shortcuts');$document.off('keyup'+eventNamespace);},scrolling:function scrolling(){$dimmable.removeClass(className.scrolling);$module.removeClass(className.scrolling);}},cacheSizes:function cacheSizes(){var modalHeight=$module.outerHeight();if(module.cache===undefined||modalHeight!==0){module.cache={pageHeight:$(document).outerHeight(),height:modalHeight+settings.offset,contextHeight:settings.context=='body'?$(window).height():$dimmable.height()};}module.debug('Caching modal and container sizes',module.cache);},can:{fit:function fit(){return module.cache.height+settings.padding*2<module.cache.contextHeight;}},is:{active:function active(){return $module.hasClass(className.active);},animating:function animating(){return $module.transition('is supported')?$module.transition('is animating'):$module.is(':visible');},scrolling:function scrolling(){return $dimmable.hasClass(className.scrolling);},modernBrowser:function modernBrowser(){// appName for IE11 reports 'Netscape' can no longer use
return!(window.ActiveXObject||"ActiveXObject"in window);}},set:{autofocus:function autofocus(){var $inputs=$module.find('[tabindex], :input').filter(':visible'),$autofocus=$inputs.filter('[autofocus]'),$input=$autofocus.length>0?$autofocus.first():$inputs.first();if($input.length>0){$input.focus();}},clickaway:function clickaway(){if(settings.closable){$dimmer.on('click'+elementEventNamespace,module.event.click);}},dimmerSettings:function dimmerSettings(){if($.fn.dimmer===undefined){module.error(error.dimmer);return;}var defaultSettings={debug:settings.debug,dimmerName:'modals',variation:false,closable:'auto',duration:{show:settings.duration,hide:settings.duration}},dimmerSettings=$.extend(true,defaultSettings,settings.dimmerSettings);if(settings.inverted){dimmerSettings.variation=dimmerSettings.variation!==undefined?dimmerSettings.variation+' inverted':'inverted';$dimmer.addClass(className.inverted);}else{$dimmer.removeClass(className.inverted);}if(settings.blurring){$dimmable.addClass(className.blurring);}else{$dimmable.removeClass(className.blurring);}$context.dimmer('setting',dimmerSettings);},screenHeight:function screenHeight(){if(module.can.fit()){$body.css('height','');}else{module.debug('Modal is taller than page content, resizing page height');$body.css('height',module.cache.height+settings.padding*2);}},active:function active(){$module.addClass(className.active);},scrolling:function scrolling(){$dimmable.addClass(className.scrolling);$module.addClass(className.scrolling);},type:function type(){if(module.can.fit()){module.verbose('Modal fits on screen');if(!module.others.active()&&!module.others.animating()){module.remove.scrolling();}}else{module.verbose('Modal cannot fit on screen setting to scrolling');module.set.scrolling();}},position:function position(){module.verbose('Centering modal on page',module.cache);if(module.can.fit()){$module.css({top:'',marginTop:-(module.cache.height/2)});}else{$module.css({marginTop:'',top:$document.scrollTop()});}},undetached:function undetached(){$dimmable.addClass(className.undetached);}},setting:function setting(name,value){module.debug('Changing setting',name,value);if($.isPlainObject(name)){$.extend(true,settings,name);}else if(value!==undefined){if($.isPlainObject(settings[name])){$.extend(true,settings[name],value);}else{settings[name]=value;}}else{return settings[name];}},internal:function internal(name,value){if($.isPlainObject(name)){$.extend(true,module,name);}else if(value!==undefined){module[name]=value;}else{return module[name];}},debug:function debug(){if(!settings.silent&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.debug=Function.prototype.bind.call(console.info,console,settings.name+':');module.debug.apply(console,arguments);}}},verbose:function verbose(){if(!settings.silent&&settings.verbose&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.verbose=Function.prototype.bind.call(console.info,console,settings.name+':');module.verbose.apply(console,arguments);}}},error:function error(){if(!settings.silent){module.error=Function.prototype.bind.call(console.error,console,settings.name+':');module.error.apply(console,arguments);}},performance:{log:function log(message){var currentTime,executionTime,previousTime;if(settings.performance){currentTime=new Date().getTime();previousTime=time||currentTime;executionTime=currentTime-previousTime;time=currentTime;performance.push({'Name':message[0],'Arguments':[].slice.call(message,1)||'','Element':element,'Execution Time':executionTime});}clearTimeout(module.performance.timer);module.performance.timer=setTimeout(module.performance.display,500);},display:function display(){var title=settings.name+':',totalTime=0;time=false;clearTimeout(module.performance.timer);$.each(performance,function(index,data){totalTime+=data['Execution Time'];});title+=' '+totalTime+'ms';if(moduleSelector){title+=' \''+moduleSelector+'\'';}if((console.group!==undefined||console.table!==undefined)&&performance.length>0){console.groupCollapsed(title);if(console.table){console.table(performance);}else{$.each(performance,function(index,data){console.log(data['Name']+': '+data['Execution Time']+'ms');});}console.groupEnd();}performance=[];}},invoke:function invoke(query,passedArguments,context){var object=instance,maxDepth,found,response;passedArguments=passedArguments||queryArguments;context=element||context;if(typeof query=='string'&&object!==undefined){query=query.split(/[\. ]/);maxDepth=query.length-1;$.each(query,function(depth,value){var camelCaseValue=depth!=maxDepth?value+query[depth+1].charAt(0).toUpperCase()+query[depth+1].slice(1):query;if($.isPlainObject(object[camelCaseValue])&&depth!=maxDepth){object=object[camelCaseValue];}else if(object[camelCaseValue]!==undefined){found=object[camelCaseValue];return false;}else if($.isPlainObject(object[value])&&depth!=maxDepth){object=object[value];}else if(object[value]!==undefined){found=object[value];return false;}else{return false;}});}if($.isFunction(found)){response=found.apply(context,passedArguments);}else if(found!==undefined){response=found;}if($.isArray(returnedValue)){returnedValue.push(response);}else if(returnedValue!==undefined){returnedValue=[returnedValue,response];}else if(response!==undefined){returnedValue=response;}return found;}};if(methodInvoked){if(instance===undefined){module.initialize();}module.invoke(query);}else{if(instance!==undefined){instance.invoke('destroy');}module.initialize();}});return returnedValue!==undefined?returnedValue:this;};$.fn.modal.settings={name:'Modal',namespace:'modal',silent:false,debug:false,verbose:false,performance:true,observeChanges:false,allowMultiple:false,detachable:true,closable:true,autofocus:true,inverted:false,blurring:false,dimmerSettings:{closable:false,useCSS:true},// whether to use keyboard shortcuts
keyboardShortcuts:true,context:'body',queue:false,duration:500,offset:0,transition:'scale',// padding with edge of page
padding:50,// called before show animation
onShow:function onShow(){},// called after show animation
onVisible:function onVisible(){},// called before hide animation
onHide:function onHide(){return true;},// called after hide animation
onHidden:function onHidden(){},// called after approve selector match
onApprove:function onApprove(){return true;},// called after deny selector match
onDeny:function onDeny(){return true;},selector:{close:'> .close',approve:'.actions .positive, .actions .approve, .actions .ok',deny:'.actions .negative, .actions .deny, .actions .cancel',modal:'.ui.modal'},error:{dimmer:'UI Dimmer, a required component is not included in this page',method:'The method you called is not defined.',notFound:'The element you specified could not be found'},className:{active:'active',animating:'animating',blurring:'blurring',inverted:'inverted',scrolling:'scrolling',undetached:'undetached'}};})(jQuery,window,document);/*!
 * # Semantic UI 2.2.11 - Nag
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */;(function($,window,document,undefined){"use strict";window=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();$.fn.nag=function(parameters){var $allModules=$(this),moduleSelector=$allModules.selector||'',time=new Date().getTime(),performance=[],query=arguments[0],methodInvoked=typeof query=='string',queryArguments=[].slice.call(arguments,1),returnedValue;$allModules.each(function(){var settings=$.isPlainObject(parameters)?$.extend(true,{},$.fn.nag.settings,parameters):$.extend({},$.fn.nag.settings),className=settings.className,selector=settings.selector,error=settings.error,namespace=settings.namespace,eventNamespace='.'+namespace,moduleNamespace=namespace+'-module',$module=$(this),$close=$module.find(selector.close),$context=settings.context?$(settings.context):$('body'),element=this,instance=$module.data(moduleNamespace),moduleOffset,moduleHeight,contextWidth,contextHeight,contextOffset,yOffset,yPosition,timer,module,requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||function(callback){setTimeout(callback,0);};module={initialize:function initialize(){module.verbose('Initializing element');$module.on('click'+eventNamespace,selector.close,module.dismiss).data(moduleNamespace,module);if(settings.detachable&&$module.parent()[0]!==$context[0]){$module.detach().prependTo($context);}if(settings.displayTime>0){setTimeout(module.hide,settings.displayTime);}module.show();},destroy:function destroy(){module.verbose('Destroying instance');$module.removeData(moduleNamespace).off(eventNamespace);},show:function show(){if(module.should.show()&&!$module.is(':visible')){module.debug('Showing nag',settings.animation.show);if(settings.animation.show=='fade'){$module.fadeIn(settings.duration,settings.easing);}else{$module.slideDown(settings.duration,settings.easing);}}},hide:function hide(){module.debug('Showing nag',settings.animation.hide);if(settings.animation.show=='fade'){$module.fadeIn(settings.duration,settings.easing);}else{$module.slideUp(settings.duration,settings.easing);}},onHide:function onHide(){module.debug('Removing nag',settings.animation.hide);$module.remove();if(settings.onHide){settings.onHide();}},dismiss:function dismiss(event){if(settings.storageMethod){module.storage.set(settings.key,settings.value);}module.hide();event.stopImmediatePropagation();event.preventDefault();},should:{show:function show(){if(settings.persist){module.debug('Persistent nag is set, can show nag');return true;}if(module.storage.get(settings.key)!=settings.value.toString()){module.debug('Stored value is not set, can show nag',module.storage.get(settings.key));return true;}module.debug('Stored value is set, cannot show nag',module.storage.get(settings.key));return false;}},get:{storageOptions:function storageOptions(){var options={};if(settings.expires){options.expires=settings.expires;}if(settings.domain){options.domain=settings.domain;}if(settings.path){options.path=settings.path;}return options;}},clear:function clear(){module.storage.remove(settings.key);},storage:{set:function set(key,value){var options=module.get.storageOptions();if(settings.storageMethod=='localstorage'&&window.localStorage!==undefined){window.localStorage.setItem(key,value);module.debug('Value stored using local storage',key,value);}else if(settings.storageMethod=='sessionstorage'&&window.sessionStorage!==undefined){window.sessionStorage.setItem(key,value);module.debug('Value stored using session storage',key,value);}else if($.cookie!==undefined){$.cookie(key,value,options);module.debug('Value stored using cookie',key,value,options);}else{module.error(error.noCookieStorage);return;}},get:function get(key,value){var storedValue;if(settings.storageMethod=='localstorage'&&window.localStorage!==undefined){storedValue=window.localStorage.getItem(key);}else if(settings.storageMethod=='sessionstorage'&&window.sessionStorage!==undefined){storedValue=window.sessionStorage.getItem(key);}// get by cookie
else if($.cookie!==undefined){storedValue=$.cookie(key);}else{module.error(error.noCookieStorage);}if(storedValue=='undefined'||storedValue=='null'||storedValue===undefined||storedValue===null){storedValue=undefined;}return storedValue;},remove:function remove(key){var options=module.get.storageOptions();if(settings.storageMethod=='localstorage'&&window.localStorage!==undefined){window.localStorage.removeItem(key);}else if(settings.storageMethod=='sessionstorage'&&window.sessionStorage!==undefined){window.sessionStorage.removeItem(key);}// store by cookie
else if($.cookie!==undefined){$.removeCookie(key,options);}else{module.error(error.noStorage);}}},setting:function setting(name,value){module.debug('Changing setting',name,value);if($.isPlainObject(name)){$.extend(true,settings,name);}else if(value!==undefined){if($.isPlainObject(settings[name])){$.extend(true,settings[name],value);}else{settings[name]=value;}}else{return settings[name];}},internal:function internal(name,value){if($.isPlainObject(name)){$.extend(true,module,name);}else if(value!==undefined){module[name]=value;}else{return module[name];}},debug:function debug(){if(!settings.silent&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.debug=Function.prototype.bind.call(console.info,console,settings.name+':');module.debug.apply(console,arguments);}}},verbose:function verbose(){if(!settings.silent&&settings.verbose&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.verbose=Function.prototype.bind.call(console.info,console,settings.name+':');module.verbose.apply(console,arguments);}}},error:function error(){if(!settings.silent){module.error=Function.prototype.bind.call(console.error,console,settings.name+':');module.error.apply(console,arguments);}},performance:{log:function log(message){var currentTime,executionTime,previousTime;if(settings.performance){currentTime=new Date().getTime();previousTime=time||currentTime;executionTime=currentTime-previousTime;time=currentTime;performance.push({'Name':message[0],'Arguments':[].slice.call(message,1)||'','Element':element,'Execution Time':executionTime});}clearTimeout(module.performance.timer);module.performance.timer=setTimeout(module.performance.display,500);},display:function display(){var title=settings.name+':',totalTime=0;time=false;clearTimeout(module.performance.timer);$.each(performance,function(index,data){totalTime+=data['Execution Time'];});title+=' '+totalTime+'ms';if(moduleSelector){title+=' \''+moduleSelector+'\'';}if((console.group!==undefined||console.table!==undefined)&&performance.length>0){console.groupCollapsed(title);if(console.table){console.table(performance);}else{$.each(performance,function(index,data){console.log(data['Name']+': '+data['Execution Time']+'ms');});}console.groupEnd();}performance=[];}},invoke:function invoke(query,passedArguments,context){var object=instance,maxDepth,found,response;passedArguments=passedArguments||queryArguments;context=element||context;if(typeof query=='string'&&object!==undefined){query=query.split(/[\. ]/);maxDepth=query.length-1;$.each(query,function(depth,value){var camelCaseValue=depth!=maxDepth?value+query[depth+1].charAt(0).toUpperCase()+query[depth+1].slice(1):query;if($.isPlainObject(object[camelCaseValue])&&depth!=maxDepth){object=object[camelCaseValue];}else if(object[camelCaseValue]!==undefined){found=object[camelCaseValue];return false;}else if($.isPlainObject(object[value])&&depth!=maxDepth){object=object[value];}else if(object[value]!==undefined){found=object[value];return false;}else{module.error(error.method,query);return false;}});}if($.isFunction(found)){response=found.apply(context,passedArguments);}else if(found!==undefined){response=found;}if($.isArray(returnedValue)){returnedValue.push(response);}else if(returnedValue!==undefined){returnedValue=[returnedValue,response];}else if(response!==undefined){returnedValue=response;}return found;}};if(methodInvoked){if(instance===undefined){module.initialize();}module.invoke(query);}else{if(instance!==undefined){instance.invoke('destroy');}module.initialize();}});return returnedValue!==undefined?returnedValue:this;};$.fn.nag.settings={name:'Nag',silent:false,debug:false,verbose:false,performance:true,namespace:'Nag',// allows cookie to be overridden
persist:false,// set to zero to require manually dismissal, otherwise hides on its own
displayTime:0,animation:{show:'slide',hide:'slide'},context:false,detachable:false,expires:30,domain:false,path:'/',// type of storage to use
storageMethod:'cookie',// value to store in dismissed localstorage/cookie
key:'nag',value:'dismiss',error:{noCookieStorage:'$.cookie is not included. A storage solution is required.',noStorage:'Neither $.cookie or store is defined. A storage solution is required for storing state',method:'The method you called is not defined.'},className:{bottom:'bottom',fixed:'fixed'},selector:{close:'.close.icon'},speed:500,easing:'easeOutQuad',onHide:function onHide(){}};// Adds easing
$.extend($.easing,{easeOutQuad:function easeOutQuad(x,t,b,c,d){return-c*(t/=d)*(t-2)+b;}});})(jQuery,window,document);/*!
 * # Semantic UI 2.2.11 - Popup
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */;(function($,window,document,undefined){"use strict";window=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();$.fn.popup=function(parameters){var $allModules=$(this),$document=$(document),$window=$(window),$body=$('body'),moduleSelector=$allModules.selector||'',hasTouch=true,time=new Date().getTime(),performance=[],query=arguments[0],methodInvoked=typeof query=='string',queryArguments=[].slice.call(arguments,1),returnedValue;$allModules.each(function(){var settings=$.isPlainObject(parameters)?$.extend(true,{},$.fn.popup.settings,parameters):$.extend({},$.fn.popup.settings),selector=settings.selector,className=settings.className,error=settings.error,metadata=settings.metadata,namespace=settings.namespace,eventNamespace='.'+settings.namespace,moduleNamespace='module-'+namespace,$module=$(this),$context=$(settings.context),$scrollContext=$(settings.scrollContext),$boundary=$(settings.boundary),$target=settings.target?$(settings.target):$module,$popup,$offsetParent,searchDepth=0,triedPositions=false,openedWithTouch=false,element=this,instance=$module.data(moduleNamespace),documentObserver,elementNamespace,_id3,module;module={// binds events
initialize:function initialize(){module.debug('Initializing',$module);module.createID();module.bind.events();if(!module.exists()&&settings.preserve){module.create();}if(settings.observeChanges){module.observeChanges();}module.instantiate();},instantiate:function instantiate(){module.verbose('Storing instance',module);instance=module;$module.data(moduleNamespace,instance);},observeChanges:function observeChanges(){if('MutationObserver'in window){documentObserver=new MutationObserver(module.event.documentChanged);documentObserver.observe(document,{childList:true,subtree:true});module.debug('Setting up mutation observer',documentObserver);}},refresh:function refresh(){if(settings.popup){$popup=$(settings.popup).eq(0);}else{if(settings.inline){$popup=$target.nextAll(selector.popup).eq(0);settings.popup=$popup;}}if(settings.popup){$popup.addClass(className.loading);$offsetParent=module.get.offsetParent($target);$popup.removeClass(className.loading);if(settings.movePopup&&module.has.popup()&&module.get.offsetParent($popup)[0]!==$offsetParent[0]){module.debug('Moving popup to the same offset parent as target');$popup.detach().appendTo($offsetParent);}}else{$offsetParent=settings.inline?module.get.offsetParent($target):module.has.popup()?module.get.offsetParent($target):$body;}if($offsetParent.is('html')&&$offsetParent[0]!==$body[0]){module.debug('Setting page as offset parent');$offsetParent=$body;}if(module.get.variation()){module.set.variation();}},reposition:function reposition(){module.refresh();module.set.position();},destroy:function destroy(){module.debug('Destroying previous module');if(documentObserver){documentObserver.disconnect();}// remove element only if was created dynamically
if($popup&&!settings.preserve){module.removePopup();}// clear all timeouts
clearTimeout(module.hideTimer);clearTimeout(module.showTimer);// remove events
module.unbind.close();module.unbind.events();$module.removeData(moduleNamespace);},event:{start:function start(event){var delay=$.isPlainObject(settings.delay)?settings.delay.show:settings.delay;clearTimeout(module.hideTimer);if(!openedWithTouch){module.showTimer=setTimeout(module.show,delay);}},end:function end(){var delay=$.isPlainObject(settings.delay)?settings.delay.hide:settings.delay;clearTimeout(module.showTimer);module.hideTimer=setTimeout(module.hide,delay);},touchstart:function touchstart(event){openedWithTouch=true;module.show();},resize:function resize(){if(module.is.visible()){module.set.position();}},documentChanged:function documentChanged(mutations){[].forEach.call(mutations,function(mutation){if(mutation.removedNodes){[].forEach.call(mutation.removedNodes,function(node){if(node==element||$(node).find(element).length>0){module.debug('Element removed from DOM, tearing down events');module.destroy();}});}});},hideGracefully:function hideGracefully(event){var $target=$(event.target),isInDOM=$.contains(document.documentElement,event.target),inPopup=$target.closest(selector.popup).length>0;// don't close on clicks inside popup
if(event&&!inPopup&&isInDOM){module.debug('Click occurred outside popup hiding popup');module.hide();}else{module.debug('Click was inside popup, keeping popup open');}}},// generates popup html from metadata
create:function create(){var html=module.get.html(),title=module.get.title(),content=module.get.content();if(html||content||title){module.debug('Creating pop-up html');if(!html){html=settings.templates.popup({title:title,content:content});}$popup=$('<div/>').addClass(className.popup).data(metadata.activator,$module).html(html);if(settings.inline){module.verbose('Inserting popup element inline',$popup);$popup.insertAfter($module);}else{module.verbose('Appending popup element to body',$popup);$popup.appendTo($context);}module.refresh();module.set.variation();if(settings.hoverable){module.bind.popup();}settings.onCreate.call($popup,element);}else if($target.next(selector.popup).length!==0){module.verbose('Pre-existing popup found');settings.inline=true;settings.popup=$target.next(selector.popup).data(metadata.activator,$module);module.refresh();if(settings.hoverable){module.bind.popup();}}else if(settings.popup){$(settings.popup).data(metadata.activator,$module);module.verbose('Used popup specified in settings');module.refresh();if(settings.hoverable){module.bind.popup();}}else{module.debug('No content specified skipping display',element);}},createID:function createID(){_id3=(Math.random().toString(16)+'000000000').substr(2,8);elementNamespace='.'+_id3;module.verbose('Creating unique id for element',_id3);},// determines popup state
toggle:function toggle(){module.debug('Toggling pop-up');if(module.is.hidden()){module.debug('Popup is hidden, showing pop-up');module.unbind.close();module.show();}else{module.debug('Popup is visible, hiding pop-up');module.hide();}},show:function show(callback){callback=callback||function(){};module.debug('Showing pop-up',settings.transition);if(module.is.hidden()&&!(module.is.active()&&module.is.dropdown())){if(!module.exists()){module.create();}if(settings.onShow.call($popup,element)===false){module.debug('onShow callback returned false, cancelling popup animation');return;}else if(!settings.preserve&&!settings.popup){module.refresh();}if($popup&&module.set.position()){module.save.conditions();if(settings.exclusive){module.hideAll();}module.animate.show(callback);}}},hide:function hide(callback){callback=callback||function(){};if(module.is.visible()||module.is.animating()){if(settings.onHide.call($popup,element)===false){module.debug('onHide callback returned false, cancelling popup animation');return;}module.remove.visible();module.unbind.close();module.restore.conditions();module.animate.hide(callback);}},hideAll:function hideAll(){$(selector.popup).filter('.'+className.popupVisible).each(function(){$(this).data(metadata.activator).popup('hide');});},exists:function exists(){if(!$popup){return false;}if(settings.inline||settings.popup){return module.has.popup();}else{return $popup.closest($context).length>=1?true:false;}},removePopup:function removePopup(){if(module.has.popup()&&!settings.popup){module.debug('Removing popup',$popup);$popup.remove();$popup=undefined;settings.onRemove.call($popup,element);}},save:{conditions:function conditions(){module.cache={title:$module.attr('title')};if(module.cache.title){$module.removeAttr('title');}module.verbose('Saving original attributes',module.cache.title);}},restore:{conditions:function conditions(){if(module.cache&&module.cache.title){$module.attr('title',module.cache.title);module.verbose('Restoring original attributes',module.cache.title);}return true;}},supports:{svg:function svg(){return typeof SVGGraphicsElement==='undefined';}},animate:{show:function show(callback){callback=$.isFunction(callback)?callback:function(){};if(settings.transition&&$.fn.transition!==undefined&&$module.transition('is supported')){module.set.visible();$popup.transition({animation:settings.transition+' in',queue:false,debug:settings.debug,verbose:settings.verbose,duration:settings.duration,onComplete:function onComplete(){module.bind.close();callback.call($popup,element);settings.onVisible.call($popup,element);}});}else{module.error(error.noTransition);}},hide:function hide(callback){callback=$.isFunction(callback)?callback:function(){};module.debug('Hiding pop-up');if(settings.onHide.call($popup,element)===false){module.debug('onHide callback returned false, cancelling popup animation');return;}if(settings.transition&&$.fn.transition!==undefined&&$module.transition('is supported')){$popup.transition({animation:settings.transition+' out',queue:false,duration:settings.duration,debug:settings.debug,verbose:settings.verbose,onComplete:function onComplete(){module.reset();callback.call($popup,element);settings.onHidden.call($popup,element);}});}else{module.error(error.noTransition);}}},change:{content:function content(html){$popup.html(html);}},get:{html:function html(){$module.removeData(metadata.html);return $module.data(metadata.html)||settings.html;},title:function title(){$module.removeData(metadata.title);return $module.data(metadata.title)||settings.title;},content:function content(){$module.removeData(metadata.content);return $module.data(metadata.content)||$module.attr('title')||settings.content;},variation:function variation(){$module.removeData(metadata.variation);return $module.data(metadata.variation)||settings.variation;},popup:function popup(){return $popup;},popupOffset:function popupOffset(){return $popup.offset();},calculations:function calculations(){var targetElement=$target[0],isWindow=$boundary[0]==window,targetPosition=settings.inline||settings.popup&&settings.movePopup?$target.position():$target.offset(),screenPosition=isWindow?{top:0,left:0}:$boundary.offset(),calculations={},scroll=isWindow?{top:$window.scrollTop(),left:$window.scrollLeft()}:{top:0,left:0},screen;calculations={// element which is launching popup
target:{element:$target[0],width:$target.outerWidth(),height:$target.outerHeight(),top:targetPosition.top,left:targetPosition.left,margin:{}},// popup itself
popup:{width:$popup.outerWidth(),height:$popup.outerHeight()},// offset container (or 3d context)
parent:{width:$offsetParent.outerWidth(),height:$offsetParent.outerHeight()},// screen boundaries
screen:{top:screenPosition.top,left:screenPosition.left,scroll:{top:scroll.top,left:scroll.left},width:$boundary.width(),height:$boundary.height()}};// add in container calcs if fluid
if(settings.setFluidWidth&&module.is.fluid()){calculations.container={width:$popup.parent().outerWidth()};calculations.popup.width=calculations.container.width;}// add in margins if inline
calculations.target.margin.top=settings.inline?parseInt(window.getComputedStyle(targetElement).getPropertyValue('margin-top'),10):0;calculations.target.margin.left=settings.inline?module.is.rtl()?parseInt(window.getComputedStyle(targetElement).getPropertyValue('margin-right'),10):parseInt(window.getComputedStyle(targetElement).getPropertyValue('margin-left'),10):0;// calculate screen boundaries
screen=calculations.screen;calculations.boundary={top:screen.top+screen.scroll.top,bottom:screen.top+screen.scroll.top+screen.height,left:screen.left+screen.scroll.left,right:screen.left+screen.scroll.left+screen.width};return calculations;},id:function id(){return _id3;},startEvent:function startEvent(){if(settings.on=='hover'){return'mouseenter';}else if(settings.on=='focus'){return'focus';}return false;},scrollEvent:function scrollEvent(){return'scroll';},endEvent:function endEvent(){if(settings.on=='hover'){return'mouseleave';}else if(settings.on=='focus'){return'blur';}return false;},distanceFromBoundary:function distanceFromBoundary(offset,calculations){var distanceFromBoundary={},popup,boundary;calculations=calculations||module.get.calculations();// shorthand
popup=calculations.popup;boundary=calculations.boundary;if(offset){distanceFromBoundary={top:offset.top-boundary.top,left:offset.left-boundary.left,right:boundary.right-(offset.left+popup.width),bottom:boundary.bottom-(offset.top+popup.height)};module.verbose('Distance from boundaries determined',offset,distanceFromBoundary);}return distanceFromBoundary;},offsetParent:function offsetParent($target){var element=$target!==undefined?$target[0]:$module[0],parentNode=element.parentNode,$node=$(parentNode);if(parentNode){var is2D=$node.css('transform')==='none',isStatic=$node.css('position')==='static',isHTML=$node.is('html');while(parentNode&&!isHTML&&isStatic&&is2D){parentNode=parentNode.parentNode;$node=$(parentNode);is2D=$node.css('transform')==='none';isStatic=$node.css('position')==='static';isHTML=$node.is('html');}}return $node&&$node.length>0?$node:$();},positions:function positions(){return{'top left':false,'top center':false,'top right':false,'bottom left':false,'bottom center':false,'bottom right':false,'left center':false,'right center':false};},nextPosition:function nextPosition(position){var positions=position.split(' '),verticalPosition=positions[0],horizontalPosition=positions[1],opposite={top:'bottom',bottom:'top',left:'right',right:'left'},adjacent={left:'center',center:'right',right:'left'},backup={'top left':'top center','top center':'top right','top right':'right center','right center':'bottom right','bottom right':'bottom center','bottom center':'bottom left','bottom left':'left center','left center':'top left'},adjacentsAvailable=verticalPosition=='top'||verticalPosition=='bottom',oppositeTried=false,adjacentTried=false,nextPosition=false;if(!triedPositions){module.verbose('All available positions available');triedPositions=module.get.positions();}module.debug('Recording last position tried',position);triedPositions[position]=true;if(settings.prefer==='opposite'){nextPosition=[opposite[verticalPosition],horizontalPosition];nextPosition=nextPosition.join(' ');oppositeTried=triedPositions[nextPosition]===true;module.debug('Trying opposite strategy',nextPosition);}if(settings.prefer==='adjacent'&&adjacentsAvailable){nextPosition=[verticalPosition,adjacent[horizontalPosition]];nextPosition=nextPosition.join(' ');adjacentTried=triedPositions[nextPosition]===true;module.debug('Trying adjacent strategy',nextPosition);}if(adjacentTried||oppositeTried){module.debug('Using backup position',nextPosition);nextPosition=backup[position];}return nextPosition;}},set:{position:function position(_position,calculations){// exit conditions
if($target.length===0||$popup.length===0){module.error(error.notFound);return;}var offset,distanceAway,target,popup,parent,positioning,popupOffset,distanceFromBoundary;calculations=calculations||module.get.calculations();_position=_position||$module.data(metadata.position)||settings.position;offset=$module.data(metadata.offset)||settings.offset;distanceAway=settings.distanceAway;// shorthand
target=calculations.target;popup=calculations.popup;parent=calculations.parent;if(target.width===0&&target.height===0&&!module.is.svg(target.element)){module.debug('Popup target is hidden, no action taken');return false;}if(settings.inline){module.debug('Adding margin to calculation',target.margin);if(_position=='left center'||_position=='right center'){offset+=target.margin.top;distanceAway+=-target.margin.left;}else if(_position=='top left'||_position=='top center'||_position=='top right'){offset+=target.margin.left;distanceAway-=target.margin.top;}else{offset+=target.margin.left;distanceAway+=target.margin.top;}}module.debug('Determining popup position from calculations',_position,calculations);if(module.is.rtl()){_position=_position.replace(/left|right/g,function(match){return match=='left'?'right':'left';});module.debug('RTL: Popup position updated',_position);}// if last attempt use specified last resort position
if(searchDepth==settings.maxSearchDepth&&typeof settings.lastResort==='string'){_position=settings.lastResort;}switch(_position){case'top left':positioning={top:'auto',bottom:parent.height-target.top+distanceAway,left:target.left+offset,right:'auto'};break;case'top center':positioning={bottom:parent.height-target.top+distanceAway,left:target.left+target.width/2-popup.width/2+offset,top:'auto',right:'auto'};break;case'top right':positioning={bottom:parent.height-target.top+distanceAway,right:parent.width-target.left-target.width-offset,top:'auto',left:'auto'};break;case'left center':positioning={top:target.top+target.height/2-popup.height/2+offset,right:parent.width-target.left+distanceAway,left:'auto',bottom:'auto'};break;case'right center':positioning={top:target.top+target.height/2-popup.height/2+offset,left:target.left+target.width+distanceAway,bottom:'auto',right:'auto'};break;case'bottom left':positioning={top:target.top+target.height+distanceAway,left:target.left+offset,bottom:'auto',right:'auto'};break;case'bottom center':positioning={top:target.top+target.height+distanceAway,left:target.left+target.width/2-popup.width/2+offset,bottom:'auto',right:'auto'};break;case'bottom right':positioning={top:target.top+target.height+distanceAway,right:parent.width-target.left-target.width-offset,left:'auto',bottom:'auto'};break;}if(positioning===undefined){module.error(error.invalidPosition,_position);}module.debug('Calculated popup positioning values',positioning);// tentatively place on stage
$popup.css(positioning).removeClass(className.position).addClass(_position).addClass(className.loading);popupOffset=module.get.popupOffset();// see if any boundaries are surpassed with this tentative position
distanceFromBoundary=module.get.distanceFromBoundary(popupOffset,calculations);if(module.is.offstage(distanceFromBoundary,_position)){module.debug('Position is outside viewport',_position);if(searchDepth<settings.maxSearchDepth){searchDepth++;_position=module.get.nextPosition(_position);module.debug('Trying new position',_position);return $popup?module.set.position(_position,calculations):false;}else{if(settings.lastResort){module.debug('No position found, showing with last position');}else{module.debug('Popup could not find a position to display',$popup);module.error(error.cannotPlace,element);module.remove.attempts();module.remove.loading();module.reset();settings.onUnplaceable.call($popup,element);return false;}}}module.debug('Position is on stage',_position);module.remove.attempts();module.remove.loading();if(settings.setFluidWidth&&module.is.fluid()){module.set.fluidWidth(calculations);}return true;},fluidWidth:function fluidWidth(calculations){calculations=calculations||module.get.calculations();module.debug('Automatically setting element width to parent width',calculations.parent.width);$popup.css('width',calculations.container.width);},variation:function variation(_variation3){_variation3=_variation3||module.get.variation();if(_variation3&&module.has.popup()){module.verbose('Adding variation to popup',_variation3);$popup.addClass(_variation3);}},visible:function visible(){$module.addClass(className.visible);}},remove:{loading:function loading(){$popup.removeClass(className.loading);},variation:function variation(_variation4){_variation4=_variation4||module.get.variation();if(_variation4){module.verbose('Removing variation',_variation4);$popup.removeClass(_variation4);}},visible:function visible(){$module.removeClass(className.visible);},attempts:function attempts(){module.verbose('Resetting all searched positions');searchDepth=0;triedPositions=false;}},bind:{events:function events(){module.debug('Binding popup events to module');if(settings.on=='click'){$module.on('click'+eventNamespace,module.toggle);}if(settings.on=='hover'&&hasTouch){$module.on('touchstart'+eventNamespace,module.event.touchstart);}if(module.get.startEvent()){$module.on(module.get.startEvent()+eventNamespace,module.event.start).on(module.get.endEvent()+eventNamespace,module.event.end);}if(settings.target){module.debug('Target set to element',$target);}$window.on('resize'+elementNamespace,module.event.resize);},popup:function popup(){module.verbose('Allowing hover events on popup to prevent closing');if($popup&&module.has.popup()){$popup.on('mouseenter'+eventNamespace,module.event.start).on('mouseleave'+eventNamespace,module.event.end);}},close:function close(){if(settings.hideOnScroll===true||settings.hideOnScroll=='auto'&&settings.on!='click'){module.bind.closeOnScroll();}if(settings.on=='hover'&&openedWithTouch){module.bind.touchClose();}if(settings.on=='click'&&settings.closable){module.bind.clickaway();}},closeOnScroll:function closeOnScroll(){module.verbose('Binding scroll close event to document');$scrollContext.one(module.get.scrollEvent()+elementNamespace,module.event.hideGracefully);},touchClose:function touchClose(){module.verbose('Binding popup touchclose event to document');$document.on('touchstart'+elementNamespace,function(event){module.verbose('Touched away from popup');module.event.hideGracefully.call(element,event);});},clickaway:function clickaway(){module.verbose('Binding popup close event to document');$document.on('click'+elementNamespace,function(event){module.verbose('Clicked away from popup');module.event.hideGracefully.call(element,event);});}},unbind:{events:function events(){$window.off(elementNamespace);$module.off(eventNamespace);},close:function close(){$document.off(elementNamespace);$scrollContext.off(elementNamespace);}},has:{popup:function popup(){return $popup&&$popup.length>0;}},is:{offstage:function offstage(distanceFromBoundary,position){var offstage=[];// return boundaries that have been surpassed
$.each(distanceFromBoundary,function(direction,distance){if(distance<-settings.jitter){module.debug('Position exceeds allowable distance from edge',direction,distance,position);offstage.push(direction);}});if(offstage.length>0){return true;}else{return false;}},svg:function svg(element){return module.supports.svg()&&element instanceof SVGGraphicsElement;},active:function active(){return $module.hasClass(className.active);},animating:function animating(){return $popup!==undefined&&$popup.hasClass(className.animating);},fluid:function fluid(){return $popup!==undefined&&$popup.hasClass(className.fluid);},visible:function visible(){return $popup!==undefined&&$popup.hasClass(className.popupVisible);},dropdown:function dropdown(){return $module.hasClass(className.dropdown);},hidden:function hidden(){return!module.is.visible();},rtl:function rtl(){return $module.css('direction')=='rtl';}},reset:function reset(){module.remove.visible();if(settings.preserve){if($.fn.transition!==undefined){$popup.transition('remove transition');}}else{module.removePopup();}},setting:function setting(name,value){if($.isPlainObject(name)){$.extend(true,settings,name);}else if(value!==undefined){settings[name]=value;}else{return settings[name];}},internal:function internal(name,value){if($.isPlainObject(name)){$.extend(true,module,name);}else if(value!==undefined){module[name]=value;}else{return module[name];}},debug:function debug(){if(!settings.silent&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.debug=Function.prototype.bind.call(console.info,console,settings.name+':');module.debug.apply(console,arguments);}}},verbose:function verbose(){if(!settings.silent&&settings.verbose&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.verbose=Function.prototype.bind.call(console.info,console,settings.name+':');module.verbose.apply(console,arguments);}}},error:function error(){if(!settings.silent){module.error=Function.prototype.bind.call(console.error,console,settings.name+':');module.error.apply(console,arguments);}},performance:{log:function log(message){var currentTime,executionTime,previousTime;if(settings.performance){currentTime=new Date().getTime();previousTime=time||currentTime;executionTime=currentTime-previousTime;time=currentTime;performance.push({'Name':message[0],'Arguments':[].slice.call(message,1)||'','Element':element,'Execution Time':executionTime});}clearTimeout(module.performance.timer);module.performance.timer=setTimeout(module.performance.display,500);},display:function display(){var title=settings.name+':',totalTime=0;time=false;clearTimeout(module.performance.timer);$.each(performance,function(index,data){totalTime+=data['Execution Time'];});title+=' '+totalTime+'ms';if(moduleSelector){title+=' \''+moduleSelector+'\'';}if((console.group!==undefined||console.table!==undefined)&&performance.length>0){console.groupCollapsed(title);if(console.table){console.table(performance);}else{$.each(performance,function(index,data){console.log(data['Name']+': '+data['Execution Time']+'ms');});}console.groupEnd();}performance=[];}},invoke:function invoke(query,passedArguments,context){var object=instance,maxDepth,found,response;passedArguments=passedArguments||queryArguments;context=element||context;if(typeof query=='string'&&object!==undefined){query=query.split(/[\. ]/);maxDepth=query.length-1;$.each(query,function(depth,value){var camelCaseValue=depth!=maxDepth?value+query[depth+1].charAt(0).toUpperCase()+query[depth+1].slice(1):query;if($.isPlainObject(object[camelCaseValue])&&depth!=maxDepth){object=object[camelCaseValue];}else if(object[camelCaseValue]!==undefined){found=object[camelCaseValue];return false;}else if($.isPlainObject(object[value])&&depth!=maxDepth){object=object[value];}else if(object[value]!==undefined){found=object[value];return false;}else{return false;}});}if($.isFunction(found)){response=found.apply(context,passedArguments);}else if(found!==undefined){response=found;}if($.isArray(returnedValue)){returnedValue.push(response);}else if(returnedValue!==undefined){returnedValue=[returnedValue,response];}else if(response!==undefined){returnedValue=response;}return found;}};if(methodInvoked){if(instance===undefined){module.initialize();}module.invoke(query);}else{if(instance!==undefined){instance.invoke('destroy');}module.initialize();}});return returnedValue!==undefined?returnedValue:this;};$.fn.popup.settings={name:'Popup',// module settings
silent:false,debug:false,verbose:false,performance:true,namespace:'popup',// whether it should use dom mutation observers
observeChanges:true,// callback only when element added to dom
onCreate:function onCreate(){},// callback before element removed from dom
onRemove:function onRemove(){},// callback before show animation
onShow:function onShow(){},// callback after show animation
onVisible:function onVisible(){},// callback before hide animation
onHide:function onHide(){},// callback when popup cannot be positioned in visible screen
onUnplaceable:function onUnplaceable(){},// callback after hide animation
onHidden:function onHidden(){},// when to show popup
on:'hover',// element to use to determine if popup is out of boundary
boundary:window,// whether to add touchstart events when using hover
addTouchEvents:true,// default position relative to element
position:'top left',// name of variation to use
variation:'',// whether popup should be moved to context
movePopup:true,// element which popup should be relative to
target:false,// jq selector or element that should be used as popup
popup:false,// popup should remain inline next to activator
inline:false,// popup should be removed from page on hide
preserve:false,// popup should not close when being hovered on
hoverable:false,// explicitly set content
content:false,// explicitly set html
html:false,// explicitly set title
title:false,// whether automatically close on clickaway when on click
closable:true,// automatically hide on scroll
hideOnScroll:'auto',// hide other popups on show
exclusive:false,// context to attach popups
context:'body',// context for binding scroll events
scrollContext:window,// position to prefer when calculating new position
prefer:'opposite',// specify position to appear even if it doesn't fit
lastResort:false,// delay used to prevent accidental refiring of animations due to user error
delay:{show:50,hide:70},// whether fluid variation should assign width explicitly
setFluidWidth:true,// transition settings
duration:200,transition:'scale',// distance away from activating element in px
distanceAway:0,// number of pixels an element is allowed to be "offstage" for a position to be chosen (allows for rounding)
jitter:2,// offset on aligning axis from calculated position
offset:0,// maximum times to look for a position before failing (9 positions total)
maxSearchDepth:15,error:{invalidPosition:'The position you specified is not a valid position',cannotPlace:'Popup does not fit within the boundaries of the viewport',method:'The method you called is not defined.',noTransition:'This module requires ui transitions <https://github.com/Semantic-Org/UI-Transition>',notFound:'The target or popup you specified does not exist on the page'},metadata:{activator:'activator',content:'content',html:'html',offset:'offset',position:'position',title:'title',variation:'variation'},className:{active:'active',animating:'animating',dropdown:'dropdown',fluid:'fluid',loading:'loading',popup:'ui popup',position:'top left center bottom right',visible:'visible',popupVisible:'visible'},selector:{popup:'.ui.popup'},templates:{escape:function escape(string){var badChars=/[&<>"'`]/g,shouldEscape=/[&<>"'`]/,escape={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},escapedChar=function escapedChar(chr){return escape[chr];};if(shouldEscape.test(string)){return string.replace(badChars,escapedChar);}return string;},popup:function popup(text){var html='',escape=$.fn.popup.settings.templates.escape;if((typeof text==='undefined'?'undefined':_typeof(text))!==undefined){if(_typeof(text.title)!==undefined&&text.title){text.title=escape(text.title);html+='<div class="header">'+text.title+'</div>';}if(_typeof(text.content)!==undefined&&text.content){text.content=escape(text.content);html+='<div class="content">'+text.content+'</div>';}}return html;}}};})(jQuery,window,document);/*!
 * # Semantic UI 2.2.11 - Progress
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */;(function($,window,document,undefined){"use strict";window=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();var global=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();$.fn.progress=function(parameters){var $allModules=$(this),moduleSelector=$allModules.selector||'',time=new Date().getTime(),performance=[],query=arguments[0],methodInvoked=typeof query=='string',queryArguments=[].slice.call(arguments,1),returnedValue;$allModules.each(function(){var _settings3=$.isPlainObject(parameters)?$.extend(true,{},$.fn.progress.settings,parameters):$.extend({},$.fn.progress.settings),className=_settings3.className,_metadata=_settings3.metadata,namespace=_settings3.namespace,selector=_settings3.selector,error=_settings3.error,eventNamespace='.'+namespace,moduleNamespace='module-'+namespace,$module=$(this),$bar=$(this).find(selector.bar),$progress=$(this).find(selector.progress),$label=$(this).find(selector.label),element=this,instance=$module.data(moduleNamespace),animating=false,transitionEnd,module;module={initialize:function initialize(){module.debug('Initializing progress bar',_settings3);module.set.duration();module.set.transitionEvent();module.read.metadata();module.read.settings();module.instantiate();},instantiate:function instantiate(){module.verbose('Storing instance of progress',module);instance=module;$module.data(moduleNamespace,module);},destroy:function destroy(){module.verbose('Destroying previous progress for',$module);clearInterval(instance.interval);module.remove.state();$module.removeData(moduleNamespace);instance=undefined;},reset:function reset(){module.remove.nextValue();module.update.progress(0);},complete:function complete(){if(module.percent===undefined||module.percent<100){module.remove.progressPoll();module.set.percent(100);}},read:{metadata:function metadata(){var data={percent:$module.data(_metadata.percent),total:$module.data(_metadata.total),value:$module.data(_metadata.value)};if(data.percent){module.debug('Current percent value set from metadata',data.percent);module.set.percent(data.percent);}if(data.total){module.debug('Total value set from metadata',data.total);module.set.total(data.total);}if(data.value){module.debug('Current value set from metadata',data.value);module.set.value(data.value);module.set.progress(data.value);}},settings:function settings(){if(_settings3.total!==false){module.debug('Current total set in settings',_settings3.total);module.set.total(_settings3.total);}if(_settings3.value!==false){module.debug('Current value set in settings',_settings3.value);module.set.value(_settings3.value);module.set.progress(module.value);}if(_settings3.percent!==false){module.debug('Current percent set in settings',_settings3.percent);module.set.percent(_settings3.percent);}}},bind:{transitionEnd:function transitionEnd(callback){var transitionEnd=module.get.transitionEnd();$bar.one(transitionEnd+eventNamespace,function(event){clearTimeout(module.failSafeTimer);callback.call(this,event);});module.failSafeTimer=setTimeout(function(){$bar.triggerHandler(transitionEnd);},_settings3.duration+_settings3.failSafeDelay);module.verbose('Adding fail safe timer',module.timer);}},increment:function increment(incrementValue){var maxValue,startValue,newValue;if(module.has.total()){startValue=module.get.value();incrementValue=incrementValue||1;newValue=startValue+incrementValue;}else{startValue=module.get.percent();incrementValue=incrementValue||module.get.randomValue();newValue=startValue+incrementValue;maxValue=100;module.debug('Incrementing percentage by',startValue,newValue);}newValue=module.get.normalizedValue(newValue);module.set.progress(newValue);},decrement:function decrement(decrementValue){var total=module.get.total(),startValue,newValue;if(total){startValue=module.get.value();decrementValue=decrementValue||1;newValue=startValue-decrementValue;module.debug('Decrementing value by',decrementValue,startValue);}else{startValue=module.get.percent();decrementValue=decrementValue||module.get.randomValue();newValue=startValue-decrementValue;module.debug('Decrementing percentage by',decrementValue,startValue);}newValue=module.get.normalizedValue(newValue);module.set.progress(newValue);},has:{progressPoll:function progressPoll(){return module.progressPoll;},total:function total(){return module.get.total()!==false;}},get:{text:function text(templateText){var value=module.value||0,total=module.total||0,percent=animating?module.get.displayPercent():module.percent||0,left=module.total>0?total-value:100-percent;templateText=templateText||'';templateText=templateText.replace('{value}',value).replace('{total}',total).replace('{left}',left).replace('{percent}',percent);module.verbose('Adding variables to progress bar text',templateText);return templateText;},normalizedValue:function normalizedValue(value){if(value<0){module.debug('Value cannot decrement below 0');return 0;}if(module.has.total()){if(value>module.total){module.debug('Value cannot increment above total',module.total);return module.total;}}else if(value>100){module.debug('Value cannot increment above 100 percent');return 100;}return value;},updateInterval:function updateInterval(){if(_settings3.updateInterval=='auto'){return _settings3.duration;}return _settings3.updateInterval;},randomValue:function randomValue(){module.debug('Generating random increment percentage');return Math.floor(Math.random()*_settings3.random.max+_settings3.random.min);},numericValue:function numericValue(value){return typeof value==='string'?value.replace(/[^\d.]/g,'')!==''?+value.replace(/[^\d.]/g,''):false:value;},transitionEnd:function transitionEnd(){var element=document.createElement('element'),transitions={'transition':'transitionend','OTransition':'oTransitionEnd','MozTransition':'transitionend','WebkitTransition':'webkitTransitionEnd'},transition;for(transition in transitions){if(element.style[transition]!==undefined){return transitions[transition];}}},// gets current displayed percentage (if animating values this is the intermediary value)
displayPercent:function displayPercent(){var barWidth=$bar.width(),totalWidth=$module.width(),minDisplay=parseInt($bar.css('min-width'),10),displayPercent=barWidth>minDisplay?barWidth/totalWidth*100:module.percent;return _settings3.precision>0?Math.round(displayPercent*(10*_settings3.precision))/(10*_settings3.precision):Math.round(displayPercent);},percent:function percent(){return module.percent||0;},value:function value(){return module.nextValue||module.value||0;},total:function total(){return module.total||false;}},create:{progressPoll:function progressPoll(){module.progressPoll=setTimeout(function(){module.update.toNextValue();module.remove.progressPoll();},module.get.updateInterval());}},is:{complete:function complete(){return module.is.success()||module.is.warning()||module.is.error();},success:function success(){return $module.hasClass(className.success);},warning:function warning(){return $module.hasClass(className.warning);},error:function error(){return $module.hasClass(className.error);},active:function active(){return $module.hasClass(className.active);},visible:function visible(){return $module.is(':visible');}},remove:{progressPoll:function progressPoll(){module.verbose('Removing progress poll timer');if(module.progressPoll){clearTimeout(module.progressPoll);delete module.progressPoll;}},nextValue:function nextValue(){module.verbose('Removing progress value stored for next update');delete module.nextValue;},state:function state(){module.verbose('Removing stored state');delete module.total;delete module.percent;delete module.value;},active:function active(){module.verbose('Removing active state');$module.removeClass(className.active);},success:function success(){module.verbose('Removing success state');$module.removeClass(className.success);},warning:function warning(){module.verbose('Removing warning state');$module.removeClass(className.warning);},error:function error(){module.verbose('Removing error state');$module.removeClass(className.error);}},set:{barWidth:function barWidth(value){if(value>100){module.error(error.tooHigh,value);}else if(value<0){module.error(error.tooLow,value);}else{$bar.css('width',value+'%');$module.attr('data-percent',parseInt(value,10));}},duration:function duration(_duration){_duration=_duration||_settings3.duration;_duration=typeof _duration=='number'?_duration+'ms':_duration;module.verbose('Setting progress bar transition duration',_duration);$bar.css({'transition-duration':_duration});},percent:function percent(_percent){_percent=typeof _percent=='string'?+_percent.replace('%',''):_percent;// round display percentage
_percent=_settings3.precision>0?Math.round(_percent*(10*_settings3.precision))/(10*_settings3.precision):Math.round(_percent);module.percent=_percent;if(!module.has.total()){module.value=_settings3.precision>0?Math.round(_percent/100*module.total*(10*_settings3.precision))/(10*_settings3.precision):Math.round(_percent/100*module.total*10)/10;if(_settings3.limitValues){module.value=module.value>100?100:module.value<0?0:module.value;}}module.set.barWidth(_percent);module.set.labelInterval();module.set.labels();_settings3.onChange.call(element,_percent,module.value,module.total);},labelInterval:function labelInterval(){var animationCallback=function animationCallback(){module.verbose('Bar finished animating, removing continuous label updates');clearInterval(module.interval);animating=false;module.set.labels();};clearInterval(module.interval);module.bind.transitionEnd(animationCallback);animating=true;module.interval=setInterval(function(){var isInDOM=$.contains(document.documentElement,element);if(!isInDOM){clearInterval(module.interval);animating=false;}module.set.labels();},_settings3.framerate);},labels:function labels(){module.verbose('Setting both bar progress and outer label text');module.set.barLabel();module.set.state();},label:function label(text){text=text||'';if(text){text=module.get.text(text);module.verbose('Setting label to text',text);$label.text(text);}},state:function state(percent){percent=percent!==undefined?percent:module.percent;if(percent===100){if(_settings3.autoSuccess&&!(module.is.warning()||module.is.error()||module.is.success())){module.set.success();module.debug('Automatically triggering success at 100%');}else{module.verbose('Reached 100% removing active state');module.remove.active();module.remove.progressPoll();}}else if(percent>0){module.verbose('Adjusting active progress bar label',percent);module.set.active();}else{module.remove.active();module.set.label(_settings3.text.active);}},barLabel:function barLabel(text){if(text!==undefined){$progress.text(module.get.text(text));}else if(_settings3.label=='ratio'&&module.total){module.verbose('Adding ratio to bar label');$progress.text(module.get.text(_settings3.text.ratio));}else if(_settings3.label=='percent'){module.verbose('Adding percentage to bar label');$progress.text(module.get.text(_settings3.text.percent));}},active:function active(text){text=text||_settings3.text.active;module.debug('Setting active state');if(_settings3.showActivity&&!module.is.active()){$module.addClass(className.active);}module.remove.warning();module.remove.error();module.remove.success();text=_settings3.onLabelUpdate('active',text,module.value,module.total);if(text){module.set.label(text);}module.bind.transitionEnd(function(){_settings3.onActive.call(element,module.value,module.total);});},success:function success(text){text=text||_settings3.text.success||_settings3.text.active;module.debug('Setting success state');$module.addClass(className.success);module.remove.active();module.remove.warning();module.remove.error();module.complete();if(_settings3.text.success){text=_settings3.onLabelUpdate('success',text,module.value,module.total);module.set.label(text);}else{text=_settings3.onLabelUpdate('active',text,module.value,module.total);module.set.label(text);}module.bind.transitionEnd(function(){_settings3.onSuccess.call(element,module.total);});},warning:function warning(text){text=text||_settings3.text.warning;module.debug('Setting warning state');$module.addClass(className.warning);module.remove.active();module.remove.success();module.remove.error();module.complete();text=_settings3.onLabelUpdate('warning',text,module.value,module.total);if(text){module.set.label(text);}module.bind.transitionEnd(function(){_settings3.onWarning.call(element,module.value,module.total);});},error:function error(text){text=text||_settings3.text.error;module.debug('Setting error state');$module.addClass(className.error);module.remove.active();module.remove.success();module.remove.warning();module.complete();text=_settings3.onLabelUpdate('error',text,module.value,module.total);if(text){module.set.label(text);}module.bind.transitionEnd(function(){_settings3.onError.call(element,module.value,module.total);});},transitionEvent:function transitionEvent(){transitionEnd=module.get.transitionEnd();},total:function total(totalValue){module.total=totalValue;},value:function value(_value5){module.value=_value5;},progress:function progress(value){if(!module.has.progressPoll()){module.debug('First update in progress update interval, immediately updating',value);module.update.progress(value);module.create.progressPoll();}else{module.debug('Updated within interval, setting next update to use new value',value);module.set.nextValue(value);}},nextValue:function nextValue(value){module.nextValue=value;}},update:{toNextValue:function toNextValue(){var nextValue=module.nextValue;if(nextValue){module.debug('Update interval complete using last updated value',nextValue);module.update.progress(nextValue);module.remove.nextValue();}},progress:function progress(value){var percentComplete;value=module.get.numericValue(value);if(value===false){module.error(error.nonNumeric,value);}value=module.get.normalizedValue(value);if(module.has.total()){module.set.value(value);percentComplete=value/module.total*100;module.debug('Calculating percent complete from total',percentComplete);module.set.percent(percentComplete);}else{percentComplete=value;module.debug('Setting value to exact percentage value',percentComplete);module.set.percent(percentComplete);}}},setting:function setting(name,value){module.debug('Changing setting',name,value);if($.isPlainObject(name)){$.extend(true,_settings3,name);}else if(value!==undefined){if($.isPlainObject(_settings3[name])){$.extend(true,_settings3[name],value);}else{_settings3[name]=value;}}else{return _settings3[name];}},internal:function internal(name,value){if($.isPlainObject(name)){$.extend(true,module,name);}else if(value!==undefined){module[name]=value;}else{return module[name];}},debug:function debug(){if(!_settings3.silent&&_settings3.debug){if(_settings3.performance){module.performance.log(arguments);}else{module.debug=Function.prototype.bind.call(console.info,console,_settings3.name+':');module.debug.apply(console,arguments);}}},verbose:function verbose(){if(!_settings3.silent&&_settings3.verbose&&_settings3.debug){if(_settings3.performance){module.performance.log(arguments);}else{module.verbose=Function.prototype.bind.call(console.info,console,_settings3.name+':');module.verbose.apply(console,arguments);}}},error:function error(){if(!_settings3.silent){module.error=Function.prototype.bind.call(console.error,console,_settings3.name+':');module.error.apply(console,arguments);}},performance:{log:function log(message){var currentTime,executionTime,previousTime;if(_settings3.performance){currentTime=new Date().getTime();previousTime=time||currentTime;executionTime=currentTime-previousTime;time=currentTime;performance.push({'Name':message[0],'Arguments':[].slice.call(message,1)||'','Element':element,'Execution Time':executionTime});}clearTimeout(module.performance.timer);module.performance.timer=setTimeout(module.performance.display,500);},display:function display(){var title=_settings3.name+':',totalTime=0;time=false;clearTimeout(module.performance.timer);$.each(performance,function(index,data){totalTime+=data['Execution Time'];});title+=' '+totalTime+'ms';if(moduleSelector){title+=' \''+moduleSelector+'\'';}if((console.group!==undefined||console.table!==undefined)&&performance.length>0){console.groupCollapsed(title);if(console.table){console.table(performance);}else{$.each(performance,function(index,data){console.log(data['Name']+': '+data['Execution Time']+'ms');});}console.groupEnd();}performance=[];}},invoke:function invoke(query,passedArguments,context){var object=instance,maxDepth,found,response;passedArguments=passedArguments||queryArguments;context=element||context;if(typeof query=='string'&&object!==undefined){query=query.split(/[\. ]/);maxDepth=query.length-1;$.each(query,function(depth,value){var camelCaseValue=depth!=maxDepth?value+query[depth+1].charAt(0).toUpperCase()+query[depth+1].slice(1):query;if($.isPlainObject(object[camelCaseValue])&&depth!=maxDepth){object=object[camelCaseValue];}else if(object[camelCaseValue]!==undefined){found=object[camelCaseValue];return false;}else if($.isPlainObject(object[value])&&depth!=maxDepth){object=object[value];}else if(object[value]!==undefined){found=object[value];return false;}else{module.error(error.method,query);return false;}});}if($.isFunction(found)){response=found.apply(context,passedArguments);}else if(found!==undefined){response=found;}if($.isArray(returnedValue)){returnedValue.push(response);}else if(returnedValue!==undefined){returnedValue=[returnedValue,response];}else if(response!==undefined){returnedValue=response;}return found;}};if(methodInvoked){if(instance===undefined){module.initialize();}module.invoke(query);}else{if(instance!==undefined){instance.invoke('destroy');}module.initialize();}});return returnedValue!==undefined?returnedValue:this;};$.fn.progress.settings={name:'Progress',namespace:'progress',silent:false,debug:false,verbose:false,performance:true,random:{min:2,max:5},duration:300,updateInterval:'auto',autoSuccess:true,showActivity:true,limitValues:true,label:'percent',precision:0,framerate:1000/30,/// 30 fps
percent:false,total:false,value:false,// delay in ms for fail safe animation callback
failSafeDelay:100,onLabelUpdate:function onLabelUpdate(state,text,value,total){return text;},onChange:function onChange(percent,value,total){},onSuccess:function onSuccess(total){},onActive:function onActive(value,total){},onError:function onError(value,total){},onWarning:function onWarning(value,total){},error:{method:'The method you called is not defined.',nonNumeric:'Progress value is non numeric',tooHigh:'Value specified is above 100%',tooLow:'Value specified is below 0%'},regExp:{variable:/\{\$*[A-z0-9]+\}/g},metadata:{percent:'percent',total:'total',value:'value'},selector:{bar:'> .bar',label:'> .label',progress:'.bar > .progress'},text:{active:false,error:false,success:false,warning:false,percent:'{percent}%',ratio:'{value} of {total}'},className:{active:'active',error:'error',success:'success',warning:'warning'}};})(jQuery,window,document);/*!
 * # Semantic UI 2.2.11 - Rating
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */;(function($,window,document,undefined){"use strict";window=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();$.fn.rating=function(parameters){var $allModules=$(this),moduleSelector=$allModules.selector||'',time=new Date().getTime(),performance=[],query=arguments[0],methodInvoked=typeof query=='string',queryArguments=[].slice.call(arguments,1),returnedValue;$allModules.each(function(){var settings=$.isPlainObject(parameters)?$.extend(true,{},$.fn.rating.settings,parameters):$.extend({},$.fn.rating.settings),namespace=settings.namespace,className=settings.className,metadata=settings.metadata,selector=settings.selector,error=settings.error,eventNamespace='.'+namespace,moduleNamespace='module-'+namespace,element=this,instance=$(this).data(moduleNamespace),$module=$(this),$icon=$module.find(selector.icon),_initialLoad3,module;module={initialize:function initialize(){module.verbose('Initializing rating module',settings);if($icon.length===0){module.setup.layout();}if(settings.interactive){module.enable();}else{module.disable();}module.set.initialLoad();module.set.rating(module.get.initialRating());module.remove.initialLoad();module.instantiate();},instantiate:function instantiate(){module.verbose('Instantiating module',settings);instance=module;$module.data(moduleNamespace,module);},destroy:function destroy(){module.verbose('Destroying previous instance',instance);module.remove.events();$module.removeData(moduleNamespace);},refresh:function refresh(){$icon=$module.find(selector.icon);},setup:{layout:function layout(){var maxRating=module.get.maxRating(),html=$.fn.rating.settings.templates.icon(maxRating);module.debug('Generating icon html dynamically');$module.html(html);module.refresh();}},event:{mouseenter:function mouseenter(){var $activeIcon=$(this);$activeIcon.nextAll().removeClass(className.selected);$module.addClass(className.selected);$activeIcon.addClass(className.selected).prevAll().addClass(className.selected);},mouseleave:function mouseleave(){$module.removeClass(className.selected);$icon.removeClass(className.selected);},click:function click(){var $activeIcon=$(this),currentRating=module.get.rating(),rating=$icon.index($activeIcon)+1,canClear=settings.clearable=='auto'?$icon.length===1:settings.clearable;if(canClear&&currentRating==rating){module.clearRating();}else{module.set.rating(rating);}}},clearRating:function clearRating(){module.debug('Clearing current rating');module.set.rating(0);},bind:{events:function events(){module.verbose('Binding events');$module.on('mouseenter'+eventNamespace,selector.icon,module.event.mouseenter).on('mouseleave'+eventNamespace,selector.icon,module.event.mouseleave).on('click'+eventNamespace,selector.icon,module.event.click);}},remove:{events:function events(){module.verbose('Removing events');$module.off(eventNamespace);},initialLoad:function initialLoad(){_initialLoad3=false;}},enable:function enable(){module.debug('Setting rating to interactive mode');module.bind.events();$module.removeClass(className.disabled);},disable:function disable(){module.debug('Setting rating to read-only mode');module.remove.events();$module.addClass(className.disabled);},is:{initialLoad:function initialLoad(){return _initialLoad3;}},get:{initialRating:function initialRating(){if($module.data(metadata.rating)!==undefined){$module.removeData(metadata.rating);return $module.data(metadata.rating);}return settings.initialRating;},maxRating:function maxRating(){if($module.data(metadata.maxRating)!==undefined){$module.removeData(metadata.maxRating);return $module.data(metadata.maxRating);}return settings.maxRating;},rating:function rating(){var currentRating=$icon.filter('.'+className.active).length;module.verbose('Current rating retrieved',currentRating);return currentRating;}},set:{rating:function rating(_rating){var ratingIndex=_rating-1>=0?_rating-1:0,$activeIcon=$icon.eq(ratingIndex);$module.removeClass(className.selected);$icon.removeClass(className.selected).removeClass(className.active);if(_rating>0){module.verbose('Setting current rating to',_rating);$activeIcon.prevAll().addBack().addClass(className.active);}if(!module.is.initialLoad()){settings.onRate.call(element,_rating);}},initialLoad:function initialLoad(){_initialLoad3=true;}},setting:function setting(name,value){module.debug('Changing setting',name,value);if($.isPlainObject(name)){$.extend(true,settings,name);}else if(value!==undefined){if($.isPlainObject(settings[name])){$.extend(true,settings[name],value);}else{settings[name]=value;}}else{return settings[name];}},internal:function internal(name,value){if($.isPlainObject(name)){$.extend(true,module,name);}else if(value!==undefined){module[name]=value;}else{return module[name];}},debug:function debug(){if(!settings.silent&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.debug=Function.prototype.bind.call(console.info,console,settings.name+':');module.debug.apply(console,arguments);}}},verbose:function verbose(){if(!settings.silent&&settings.verbose&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.verbose=Function.prototype.bind.call(console.info,console,settings.name+':');module.verbose.apply(console,arguments);}}},error:function error(){if(!settings.silent){module.error=Function.prototype.bind.call(console.error,console,settings.name+':');module.error.apply(console,arguments);}},performance:{log:function log(message){var currentTime,executionTime,previousTime;if(settings.performance){currentTime=new Date().getTime();previousTime=time||currentTime;executionTime=currentTime-previousTime;time=currentTime;performance.push({'Name':message[0],'Arguments':[].slice.call(message,1)||'','Element':element,'Execution Time':executionTime});}clearTimeout(module.performance.timer);module.performance.timer=setTimeout(module.performance.display,500);},display:function display(){var title=settings.name+':',totalTime=0;time=false;clearTimeout(module.performance.timer);$.each(performance,function(index,data){totalTime+=data['Execution Time'];});title+=' '+totalTime+'ms';if(moduleSelector){title+=' \''+moduleSelector+'\'';}if($allModules.length>1){title+=' '+'('+$allModules.length+')';}if((console.group!==undefined||console.table!==undefined)&&performance.length>0){console.groupCollapsed(title);if(console.table){console.table(performance);}else{$.each(performance,function(index,data){console.log(data['Name']+': '+data['Execution Time']+'ms');});}console.groupEnd();}performance=[];}},invoke:function invoke(query,passedArguments,context){var object=instance,maxDepth,found,response;passedArguments=passedArguments||queryArguments;context=element||context;if(typeof query=='string'&&object!==undefined){query=query.split(/[\. ]/);maxDepth=query.length-1;$.each(query,function(depth,value){var camelCaseValue=depth!=maxDepth?value+query[depth+1].charAt(0).toUpperCase()+query[depth+1].slice(1):query;if($.isPlainObject(object[camelCaseValue])&&depth!=maxDepth){object=object[camelCaseValue];}else if(object[camelCaseValue]!==undefined){found=object[camelCaseValue];return false;}else if($.isPlainObject(object[value])&&depth!=maxDepth){object=object[value];}else if(object[value]!==undefined){found=object[value];return false;}else{return false;}});}if($.isFunction(found)){response=found.apply(context,passedArguments);}else if(found!==undefined){response=found;}if($.isArray(returnedValue)){returnedValue.push(response);}else if(returnedValue!==undefined){returnedValue=[returnedValue,response];}else if(response!==undefined){returnedValue=response;}return found;}};if(methodInvoked){if(instance===undefined){module.initialize();}module.invoke(query);}else{if(instance!==undefined){instance.invoke('destroy');}module.initialize();}});return returnedValue!==undefined?returnedValue:this;};$.fn.rating.settings={name:'Rating',namespace:'rating',slent:false,debug:false,verbose:false,performance:true,initialRating:0,interactive:true,maxRating:4,clearable:'auto',fireOnInit:false,onRate:function onRate(rating){},error:{method:'The method you called is not defined',noMaximum:'No maximum rating specified. Cannot generate HTML automatically'},metadata:{rating:'rating',maxRating:'maxRating'},className:{active:'active',disabled:'disabled',selected:'selected',loading:'loading'},selector:{icon:'.icon'},templates:{icon:function icon(maxRating){var icon=1,html='';while(icon<=maxRating){html+='<i class="icon"></i>';icon++;}return html;}}};})(jQuery,window,document);/*!
 * # Semantic UI 2.2.11 - Search
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */;(function($,window,document,undefined){"use strict";window=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();$.fn.search=function(parameters){var $allModules=$(this),moduleSelector=$allModules.selector||'',time=new Date().getTime(),performance=[],query=arguments[0],methodInvoked=typeof query=='string',queryArguments=[].slice.call(arguments,1),returnedValue;$(this).each(function(){var settings=$.isPlainObject(parameters)?$.extend(true,{},$.fn.search.settings,parameters):$.extend({},$.fn.search.settings),className=settings.className,metadata=settings.metadata,regExp=settings.regExp,fields=settings.fields,selector=settings.selector,error=settings.error,namespace=settings.namespace,eventNamespace='.'+namespace,moduleNamespace=namespace+'-module',$module=$(this),$prompt=$module.find(selector.prompt),$searchButton=$module.find(selector.searchButton),$results=$module.find(selector.results),$result=$module.find(selector.result),$category=$module.find(selector.category),element=this,instance=$module.data(moduleNamespace),disabledBubbled=false,resultsDismissed=false,module;module={initialize:function initialize(){module.verbose('Initializing module');module.determine.searchFields();module.bind.events();module.set.type();module.create.results();module.instantiate();},instantiate:function instantiate(){module.verbose('Storing instance of module',module);instance=module;$module.data(moduleNamespace,module);},destroy:function destroy(){module.verbose('Destroying instance');$module.off(eventNamespace).removeData(moduleNamespace);},refresh:function refresh(){module.debug('Refreshing selector cache');$prompt=$module.find(selector.prompt);$searchButton=$module.find(selector.searchButton);$category=$module.find(selector.category);$results=$module.find(selector.results);$result=$module.find(selector.result);},refreshResults:function refreshResults(){$results=$module.find(selector.results);$result=$module.find(selector.result);},bind:{events:function events(){module.verbose('Binding events to search');if(settings.automatic){$module.on(module.get.inputEvent()+eventNamespace,selector.prompt,module.event.input);$prompt.attr('autocomplete','off');}$module// prompt
.on('focus'+eventNamespace,selector.prompt,module.event.focus).on('blur'+eventNamespace,selector.prompt,module.event.blur).on('keydown'+eventNamespace,selector.prompt,module.handleKeyboard)// search button
.on('click'+eventNamespace,selector.searchButton,module.query)// results
.on('mousedown'+eventNamespace,selector.results,module.event.result.mousedown).on('mouseup'+eventNamespace,selector.results,module.event.result.mouseup).on('click'+eventNamespace,selector.result,module.event.result.click);}},determine:{searchFields:function searchFields(){// this makes sure $.extend does not add specified search fields to default fields
// this is the only setting which should not extend defaults
if(parameters&&parameters.searchFields!==undefined){settings.searchFields=parameters.searchFields;}}},event:{input:function input(){if(settings.searchDelay){clearTimeout(module.timer);module.timer=setTimeout(function(){if(module.is.focused()){module.query();}},settings.searchDelay);}else{module.query();}},focus:function focus(){module.set.focus();if(settings.searchOnFocus&&module.has.minimumCharacters()){module.query(function(){if(module.can.show()){module.showResults();}});}},blur:function blur(event){var pageLostFocus=document.activeElement===this,callback=function callback(){module.cancel.query();module.remove.focus();module.timer=setTimeout(module.hideResults,settings.hideDelay);};if(pageLostFocus){return;}resultsDismissed=false;if(module.resultsClicked){module.debug('Determining if user action caused search to close');$module.one('click.close'+eventNamespace,selector.results,function(event){if(module.is.inMessage(event)||disabledBubbled){$prompt.focus();return;}disabledBubbled=false;if(!module.is.animating()&&!module.is.hidden()){callback();}});}else{module.debug('Input blurred without user action, closing results');callback();}},result:{mousedown:function mousedown(){module.resultsClicked=true;},mouseup:function mouseup(){module.resultsClicked=false;},click:function click(event){module.debug('Search result selected');var $result=$(this),$title=$result.find(selector.title).eq(0),$link=$result.is('a[href]')?$result:$result.find('a[href]').eq(0),href=$link.attr('href')||false,target=$link.attr('target')||false,title=$title.html(),// title is used for result lookup
value=$title.length>0?$title.text():false,results=module.get.results(),result=$result.data(metadata.result)||module.get.result(value,results),returnedValue;if($.isFunction(settings.onSelect)){if(settings.onSelect.call(element,result,results)===false){module.debug('Custom onSelect callback cancelled default select action');disabledBubbled=true;return;}}module.hideResults();if(value){module.set.value(value);}if(href){module.verbose('Opening search link found in result',$link);if(target=='_blank'||event.ctrlKey){window.open(href);}else{window.location.href=href;}}}}},handleKeyboard:function handleKeyboard(event){var// force selector refresh
$result=$module.find(selector.result),$category=$module.find(selector.category),$activeResult=$result.filter('.'+className.active),currentIndex=$result.index($activeResult),resultSize=$result.length,hasActiveResult=$activeResult.length>0,keyCode=event.which,keys={backspace:8,enter:13,escape:27,upArrow:38,downArrow:40},newIndex;// search shortcuts
if(keyCode==keys.escape){module.verbose('Escape key pressed, blurring search field');module.hideResults();resultsDismissed=true;}if(module.is.visible()){if(keyCode==keys.enter){module.verbose('Enter key pressed, selecting active result');if($result.filter('.'+className.active).length>0){module.event.result.click.call($result.filter('.'+className.active),event);event.preventDefault();return false;}}else if(keyCode==keys.upArrow&&hasActiveResult){module.verbose('Up key pressed, changing active result');newIndex=currentIndex-1<0?currentIndex:currentIndex-1;$category.removeClass(className.active);$result.removeClass(className.active).eq(newIndex).addClass(className.active).closest($category).addClass(className.active);event.preventDefault();}else if(keyCode==keys.downArrow){module.verbose('Down key pressed, changing active result');newIndex=currentIndex+1>=resultSize?currentIndex:currentIndex+1;$category.removeClass(className.active);$result.removeClass(className.active).eq(newIndex).addClass(className.active).closest($category).addClass(className.active);event.preventDefault();}}else{// query shortcuts
if(keyCode==keys.enter){module.verbose('Enter key pressed, executing query');module.query();module.set.buttonPressed();$prompt.one('keyup',module.remove.buttonFocus);}}},setup:{api:function api(searchTerm,callback){var apiSettings={debug:settings.debug,on:false,cache:true,action:'search',urlData:{query:searchTerm},onSuccess:function onSuccess(response){module.parse.response.call(element,response,searchTerm);callback();},onFailure:function onFailure(){module.displayMessage(error.serverError);callback();},onAbort:function onAbort(response){},onError:module.error},searchHTML;$.extend(true,apiSettings,settings.apiSettings);module.verbose('Setting up API request',apiSettings);$module.api(apiSettings);}},can:{useAPI:function useAPI(){return $.fn.api!==undefined;},show:function show(){return module.is.focused()&&!module.is.visible()&&!module.is.empty();},transition:function transition(){return settings.transition&&$.fn.transition!==undefined&&$module.transition('is supported');}},is:{animating:function animating(){return $results.hasClass(className.animating);},hidden:function hidden(){return $results.hasClass(className.hidden);},inMessage:function inMessage(event){if(!event.target){return;}var $target=$(event.target),isInDOM=$.contains(document.documentElement,event.target);return isInDOM&&$target.closest(selector.message).length>0;},empty:function empty(){return $results.html()==='';},visible:function visible(){return $results.filter(':visible').length>0;},focused:function focused(){return $prompt.filter(':focus').length>0;}},get:{inputEvent:function inputEvent(){var prompt=$prompt[0],inputEvent=prompt!==undefined&&prompt.oninput!==undefined?'input':prompt!==undefined&&prompt.onpropertychange!==undefined?'propertychange':'keyup';return inputEvent;},value:function value(){return $prompt.val();},results:function results(){var results=$module.data(metadata.results);return results;},result:function result(value,results){var lookupFields=['title','id'],result=false;value=value!==undefined?value:module.get.value();results=results!==undefined?results:module.get.results();if(settings.type==='category'){module.debug('Finding result that matches',value);$.each(results,function(index,category){if($.isArray(category.results)){result=module.search.object(value,category.results,lookupFields)[0];// don't continue searching if a result is found
if(result){return false;}}});}else{module.debug('Finding result in results object',value);result=module.search.object(value,results,lookupFields)[0];}return result||false;}},select:{firstResult:function firstResult(){module.verbose('Selecting first result');$result.first().addClass(className.active);}},set:{focus:function focus(){$module.addClass(className.focus);},loading:function loading(){$module.addClass(className.loading);},value:function value(_value6){module.verbose('Setting search input value',_value6);$prompt.val(_value6);},type:function type(_type){_type=_type||settings.type;if(settings.type=='category'){$module.addClass(settings.type);}},buttonPressed:function buttonPressed(){$searchButton.addClass(className.pressed);}},remove:{loading:function loading(){$module.removeClass(className.loading);},focus:function focus(){$module.removeClass(className.focus);},buttonPressed:function buttonPressed(){$searchButton.removeClass(className.pressed);}},query:function query(callback){callback=$.isFunction(callback)?callback:function(){};var searchTerm=module.get.value(),cache=module.read.cache(searchTerm);callback=callback||function(){};if(module.has.minimumCharacters()){if(cache){module.debug('Reading result from cache',searchTerm);module.save.results(cache.results);module.addResults(cache.html);module.inject.id(cache.results);callback();}else{module.debug('Querying for',searchTerm);if($.isPlainObject(settings.source)||$.isArray(settings.source)){module.search.local(searchTerm);callback();}else if(module.can.useAPI()){module.search.remote(searchTerm,callback);}else{module.error(error.source);callback();}}settings.onSearchQuery.call(element,searchTerm);}else{module.hideResults();}},search:{local:function local(searchTerm){var results=module.search.object(searchTerm,settings.content),searchHTML;module.set.loading();module.save.results(results);module.debug('Returned local search results',results);searchHTML=module.generateResults({results:results});module.remove.loading();module.addResults(searchHTML);module.inject.id(results);module.write.cache(searchTerm,{html:searchHTML,results:results});},remote:function remote(searchTerm,callback){callback=$.isFunction(callback)?callback:function(){};if($module.api('is loading')){$module.api('abort');}module.setup.api(searchTerm,callback);$module.api('query');},object:function object(searchTerm,source,searchFields){var results=[],fuzzyResults=[],searchExp=searchTerm.toString().replace(regExp.escape,'\\$&'),matchRegExp=new RegExp(regExp.beginsWith+searchExp,'i'),// avoid duplicates when pushing results
addResult=function addResult(array,result){var notResult=$.inArray(result,results)==-1,notFuzzyResult=$.inArray(result,fuzzyResults)==-1;if(notResult&&notFuzzyResult){array.push(result);}};source=source||settings.source;searchFields=searchFields!==undefined?searchFields:settings.searchFields;// search fields should be array to loop correctly
if(!$.isArray(searchFields)){searchFields=[searchFields];}// exit conditions if no source
if(source===undefined||source===false){module.error(error.source);return[];}// iterate through search fields looking for matches
$.each(searchFields,function(index,field){$.each(source,function(label,content){var fieldExists=typeof content[field]=='string';if(fieldExists){if(content[field].search(matchRegExp)!==-1){// content starts with value (first in results)
addResult(results,content);}else if(settings.searchFullText&&module.fuzzySearch(searchTerm,content[field])){// content fuzzy matches (last in results)
addResult(fuzzyResults,content);}}});});return $.merge(results,fuzzyResults);}},fuzzySearch:function fuzzySearch(query,term){var termLength=term.length,queryLength=query.length;if(typeof query!=='string'){return false;}query=query.toLowerCase();term=term.toLowerCase();if(queryLength>termLength){return false;}if(queryLength===termLength){return query===term;}search:for(var characterIndex=0,nextCharacterIndex=0;characterIndex<queryLength;characterIndex++){var queryCharacter=query.charCodeAt(characterIndex);while(nextCharacterIndex<termLength){if(term.charCodeAt(nextCharacterIndex++)===queryCharacter){continue search;}}return false;}return true;},parse:{response:function response(_response,searchTerm){var searchHTML=module.generateResults(_response);module.verbose('Parsing server response',_response);if(_response!==undefined){if(searchTerm!==undefined&&_response[fields.results]!==undefined){module.addResults(searchHTML);module.inject.id(_response[fields.results]);module.write.cache(searchTerm,{html:searchHTML,results:_response[fields.results]});module.save.results(_response[fields.results]);}}}},cancel:{query:function query(){if(module.can.useAPI()){$module.api('abort');}}},has:{minimumCharacters:function minimumCharacters(){var searchTerm=module.get.value(),numCharacters=searchTerm.length;return numCharacters>=settings.minCharacters;},results:function results(){if($results.length===0){return false;}var html=$results.html();return html!='';}},clear:{cache:function cache(value){var cache=$module.data(metadata.cache);if(!value){module.debug('Clearing cache',value);$module.removeData(metadata.cache);}else if(value&&cache&&cache[value]){module.debug('Removing value from cache',value);delete cache[value];$module.data(metadata.cache,cache);}}},read:{cache:function cache(name){var cache=$module.data(metadata.cache);if(settings.cache){module.verbose('Checking cache for generated html for query',name);return(typeof cache==='undefined'?'undefined':_typeof(cache))=='object'&&cache[name]!==undefined?cache[name]:false;}return false;}},create:{id:function id(resultIndex,categoryIndex){var resultID=resultIndex+1,// not zero indexed
categoryID=categoryIndex+1,firstCharCode,letterID,id;if(categoryIndex!==undefined){// start char code for "A"
letterID=String.fromCharCode(97+categoryIndex);id=letterID+resultID;module.verbose('Creating category result id',id);}else{id=resultID;module.verbose('Creating result id',id);}return id;},results:function results(){if($results.length===0){$results=$('<div />').addClass(className.results).appendTo($module);}}},inject:{result:function result(_result,resultIndex,categoryIndex){module.verbose('Injecting result into results');var $selectedResult=categoryIndex!==undefined?$results.children().eq(categoryIndex).children(selector.result).eq(resultIndex):$results.children(selector.result).eq(resultIndex);module.verbose('Injecting results metadata',$selectedResult);$selectedResult.data(metadata.result,_result);},id:function id(results){module.debug('Injecting unique ids into results');var// since results may be object, we must use counters
categoryIndex=0,resultIndex=0;if(settings.type==='category'){// iterate through each category result
$.each(results,function(index,category){resultIndex=0;$.each(category.results,function(index,value){var result=category.results[index];if(result.id===undefined){result.id=module.create.id(resultIndex,categoryIndex);}module.inject.result(result,resultIndex,categoryIndex);resultIndex++;});categoryIndex++;});}else{// top level
$.each(results,function(index,value){var result=results[index];if(result.id===undefined){result.id=module.create.id(resultIndex);}module.inject.result(result,resultIndex);resultIndex++;});}return results;}},save:{results:function results(_results){module.verbose('Saving current search results to metadata',_results);$module.data(metadata.results,_results);}},write:{cache:function cache(name,value){var cache=$module.data(metadata.cache)!==undefined?$module.data(metadata.cache):{};if(settings.cache){module.verbose('Writing generated html to cache',name,value);cache[name]=value;$module.data(metadata.cache,cache);}}},addResults:function addResults(html){if($.isFunction(settings.onResultsAdd)){if(settings.onResultsAdd.call($results,html)===false){module.debug('onResultsAdd callback cancelled default action');return false;}}if(html){$results.html(html);module.refreshResults();if(settings.selectFirstResult){module.select.firstResult();}module.showResults();}else{module.hideResults(function(){$results.empty();});}},showResults:function showResults(callback){callback=$.isFunction(callback)?callback:function(){};if(resultsDismissed){return;}if(!module.is.visible()&&module.has.results()){if(module.can.transition()){module.debug('Showing results with css animations');$results.transition({animation:settings.transition+' in',debug:settings.debug,verbose:settings.verbose,duration:settings.duration,onComplete:function onComplete(){callback();},queue:true});}else{module.debug('Showing results with javascript');$results.stop().fadeIn(settings.duration,settings.easing);}settings.onResultsOpen.call($results);}},hideResults:function hideResults(callback){callback=$.isFunction(callback)?callback:function(){};if(module.is.visible()){if(module.can.transition()){module.debug('Hiding results with css animations');$results.transition({animation:settings.transition+' out',debug:settings.debug,verbose:settings.verbose,duration:settings.duration,onComplete:function onComplete(){callback();},queue:true});}else{module.debug('Hiding results with javascript');$results.stop().fadeOut(settings.duration,settings.easing);}settings.onResultsClose.call($results);}},generateResults:function generateResults(response){module.debug('Generating html from response',response);var template=settings.templates[settings.type],isProperObject=$.isPlainObject(response[fields.results])&&!$.isEmptyObject(response[fields.results]),isProperArray=$.isArray(response[fields.results])&&response[fields.results].length>0,html='';if(isProperObject||isProperArray){if(settings.maxResults>0){if(isProperObject){if(settings.type=='standard'){module.error(error.maxResults);}}else{response[fields.results]=response[fields.results].slice(0,settings.maxResults);}}if($.isFunction(template)){html=template(response,fields);}else{module.error(error.noTemplate,false);}}else if(settings.showNoResults){html=module.displayMessage(error.noResults,'empty');}settings.onResults.call(element,response);return html;},displayMessage:function displayMessage(text,type){type=type||'standard';module.debug('Displaying message',text,type);module.addResults(settings.templates.message(text,type));return settings.templates.message(text,type);},setting:function setting(name,value){if($.isPlainObject(name)){$.extend(true,settings,name);}else if(value!==undefined){settings[name]=value;}else{return settings[name];}},internal:function internal(name,value){if($.isPlainObject(name)){$.extend(true,module,name);}else if(value!==undefined){module[name]=value;}else{return module[name];}},debug:function debug(){if(!settings.silent&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.debug=Function.prototype.bind.call(console.info,console,settings.name+':');module.debug.apply(console,arguments);}}},verbose:function verbose(){if(!settings.silent&&settings.verbose&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.verbose=Function.prototype.bind.call(console.info,console,settings.name+':');module.verbose.apply(console,arguments);}}},error:function error(){if(!settings.silent){module.error=Function.prototype.bind.call(console.error,console,settings.name+':');module.error.apply(console,arguments);}},performance:{log:function log(message){var currentTime,executionTime,previousTime;if(settings.performance){currentTime=new Date().getTime();previousTime=time||currentTime;executionTime=currentTime-previousTime;time=currentTime;performance.push({'Name':message[0],'Arguments':[].slice.call(message,1)||'','Element':element,'Execution Time':executionTime});}clearTimeout(module.performance.timer);module.performance.timer=setTimeout(module.performance.display,500);},display:function display(){var title=settings.name+':',totalTime=0;time=false;clearTimeout(module.performance.timer);$.each(performance,function(index,data){totalTime+=data['Execution Time'];});title+=' '+totalTime+'ms';if(moduleSelector){title+=' \''+moduleSelector+'\'';}if($allModules.length>1){title+=' '+'('+$allModules.length+')';}if((console.group!==undefined||console.table!==undefined)&&performance.length>0){console.groupCollapsed(title);if(console.table){console.table(performance);}else{$.each(performance,function(index,data){console.log(data['Name']+': '+data['Execution Time']+'ms');});}console.groupEnd();}performance=[];}},invoke:function invoke(query,passedArguments,context){var object=instance,maxDepth,found,response;passedArguments=passedArguments||queryArguments;context=element||context;if(typeof query=='string'&&object!==undefined){query=query.split(/[\. ]/);maxDepth=query.length-1;$.each(query,function(depth,value){var camelCaseValue=depth!=maxDepth?value+query[depth+1].charAt(0).toUpperCase()+query[depth+1].slice(1):query;if($.isPlainObject(object[camelCaseValue])&&depth!=maxDepth){object=object[camelCaseValue];}else if(object[camelCaseValue]!==undefined){found=object[camelCaseValue];return false;}else if($.isPlainObject(object[value])&&depth!=maxDepth){object=object[value];}else if(object[value]!==undefined){found=object[value];return false;}else{return false;}});}if($.isFunction(found)){response=found.apply(context,passedArguments);}else if(found!==undefined){response=found;}if($.isArray(returnedValue)){returnedValue.push(response);}else if(returnedValue!==undefined){returnedValue=[returnedValue,response];}else if(response!==undefined){returnedValue=response;}return found;}};if(methodInvoked){if(instance===undefined){module.initialize();}module.invoke(query);}else{if(instance!==undefined){instance.invoke('destroy');}module.initialize();}});return returnedValue!==undefined?returnedValue:this;};$.fn.search.settings={name:'Search',namespace:'search',silent:false,debug:false,verbose:false,performance:true,// template to use (specified in settings.templates)
type:'standard',// minimum characters required to search
minCharacters:1,// whether to select first result after searching automatically
selectFirstResult:false,// API config
apiSettings:false,// object to search
source:false,// Whether search should query current term on focus
searchOnFocus:true,// fields to search
searchFields:['title','description'],// field to display in standard results template
displayField:'',// whether to include fuzzy results in local search
searchFullText:true,// whether to add events to prompt automatically
automatic:true,// delay before hiding menu after blur
hideDelay:0,// delay before searching
searchDelay:200,// maximum results returned from local
maxResults:7,// whether to store lookups in local cache
cache:true,// whether no results errors should be shown
showNoResults:true,// transition settings
transition:'scale',duration:200,easing:'easeOutExpo',// callbacks
onSelect:false,onResultsAdd:false,onSearchQuery:function onSearchQuery(query){},onResults:function onResults(response){},onResultsOpen:function onResultsOpen(){},onResultsClose:function onResultsClose(){},className:{animating:'animating',active:'active',empty:'empty',focus:'focus',hidden:'hidden',loading:'loading',results:'results',pressed:'down'},error:{source:'Cannot search. No source used, and Semantic API module was not included',noResults:'Your search returned no results',logging:'Error in debug logging, exiting.',noEndpoint:'No search endpoint was specified',noTemplate:'A valid template name was not specified.',serverError:'There was an issue querying the server.',maxResults:'Results must be an array to use maxResults setting',method:'The method you called is not defined.'},metadata:{cache:'cache',results:'results',result:'result'},regExp:{escape:/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,beginsWith:'(?:\s|^)'},// maps api response attributes to internal representation
fields:{categories:'results',// array of categories (category view)
categoryName:'name',// name of category (category view)
categoryResults:'results',// array of results (category view)
description:'description',// result description
image:'image',// result image
price:'price',// result price
results:'results',// array of results (standard)
title:'title',// result title
url:'url',// result url
action:'action',// "view more" object name
actionText:'text',// "view more" text
actionURL:'url'// "view more" url
},selector:{prompt:'.prompt',searchButton:'.search.button',results:'.results',message:'.results > .message',category:'.category',result:'.result',title:'.title, .name'},templates:{escape:function escape(string){var badChars=/[&<>"'`]/g,shouldEscape=/[&<>"'`]/,escape={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},escapedChar=function escapedChar(chr){return escape[chr];};if(shouldEscape.test(string)){return string.replace(badChars,escapedChar);}return string;},message:function message(_message3,type){var html='';if(_message3!==undefined&&type!==undefined){html+=''+'<div class="message '+type+'">';// message type
if(type=='empty'){html+=''+'<div class="header">No Results</div class="header">'+'<div class="description">'+_message3+'</div class="description">';}else{html+=' <div class="description">'+_message3+'</div>';}html+='</div>';}return html;},category:function category(response,fields){var html='',escape=$.fn.search.settings.templates.escape;if(response[fields.categoryResults]!==undefined){// each category
$.each(response[fields.categoryResults],function(index,category){if(category[fields.results]!==undefined&&category.results.length>0){html+='<div class="category">';if(category[fields.categoryName]!==undefined){html+='<div class="name">'+category[fields.categoryName]+'</div>';}// each item inside category
$.each(category.results,function(index,result){if(result[fields.url]){html+='<a class="result" href="'+result[fields.url]+'">';}else{html+='<a class="result">';}if(result[fields.image]!==undefined){html+=''+'<div class="image">'+' <img src="'+result[fields.image]+'">'+'</div>';}html+='<div class="content">';if(result[fields.price]!==undefined){html+='<div class="price">'+result[fields.price]+'</div>';}if(result[fields.title]!==undefined){html+='<div class="title">'+result[fields.title]+'</div>';}if(result[fields.description]!==undefined){html+='<div class="description">'+result[fields.description]+'</div>';}html+=''+'</div>';html+='</a>';});html+=''+'</div>';}});if(response[fields.action]){html+=''+'<a href="'+response[fields.action][fields.actionURL]+'" class="action">'+response[fields.action][fields.actionText]+'</a>';}return html;}return false;},standard:function standard(response,fields){var html='';if(response[fields.results]!==undefined){// each result
$.each(response[fields.results],function(index,result){if(result[fields.url]){html+='<a class="result" href="'+result[fields.url]+'">';}else{html+='<a class="result">';}if(result[fields.image]!==undefined){html+=''+'<div class="image">'+' <img src="'+result[fields.image]+'">'+'</div>';}html+='<div class="content">';if(result[fields.price]!==undefined){html+='<div class="price">'+result[fields.price]+'</div>';}if(result[fields.title]!==undefined){html+='<div class="title">'+result[fields.title]+'</div>';}if(result[fields.description]!==undefined){html+='<div class="description">'+result[fields.description]+'</div>';}html+=''+'</div>';html+='</a>';});if(response[fields.action]){html+=''+'<a href="'+response[fields.action][fields.actionURL]+'" class="action">'+response[fields.action][fields.actionText]+'</a>';}return html;}return false;}}};})(jQuery,window,document);/*!
 * # Semantic UI 2.2.11 - Shape
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */;(function($,window,document,undefined){"use strict";window=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();$.fn.shape=function(parameters){var $allModules=$(this),$body=$('body'),time=new Date().getTime(),performance=[],query=arguments[0],methodInvoked=typeof query=='string',queryArguments=[].slice.call(arguments,1),requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||function(callback){setTimeout(callback,0);},returnedValue;$allModules.each(function(){var moduleSelector=$allModules.selector||'',settings=$.isPlainObject(parameters)?$.extend(true,{},$.fn.shape.settings,parameters):$.extend({},$.fn.shape.settings),// internal aliases
namespace=settings.namespace,selector=settings.selector,error=settings.error,className=settings.className,// define namespaces for modules
eventNamespace='.'+namespace,moduleNamespace='module-'+namespace,// selector cache
$module=$(this),$sides=$module.find(selector.sides),$side=$module.find(selector.side),// private variables
nextIndex=false,$activeSide,$nextSide,// standard module
element=this,instance=$module.data(moduleNamespace),module;module={initialize:function initialize(){module.verbose('Initializing module for',element);module.set.defaultSide();module.instantiate();},instantiate:function instantiate(){module.verbose('Storing instance of module',module);instance=module;$module.data(moduleNamespace,instance);},destroy:function destroy(){module.verbose('Destroying previous module for',element);$module.removeData(moduleNamespace).off(eventNamespace);},refresh:function refresh(){module.verbose('Refreshing selector cache for',element);$module=$(element);$sides=$(this).find(selector.shape);$side=$(this).find(selector.side);},repaint:function repaint(){module.verbose('Forcing repaint event');var shape=$sides[0]||document.createElement('div'),fakeAssignment=shape.offsetWidth;},animate:function animate(propertyObject,callback){module.verbose('Animating box with properties',propertyObject);callback=callback||function(event){module.verbose('Executing animation callback');if(event!==undefined){event.stopPropagation();}module.reset();module.set.active();};settings.beforeChange.call($nextSide[0]);if(module.get.transitionEvent()){module.verbose('Starting CSS animation');$module.addClass(className.animating);$sides.css(propertyObject).one(module.get.transitionEvent(),callback);module.set.duration(settings.duration);requestAnimationFrame(function(){$module.addClass(className.animating);$activeSide.addClass(className.hidden);});}else{callback();}},queue:function queue(method){module.debug('Queueing animation of',method);$sides.one(module.get.transitionEvent(),function(){module.debug('Executing queued animation');setTimeout(function(){$module.shape(method);},0);});},reset:function reset(){module.verbose('Animating states reset');$module.removeClass(className.animating).attr('style','').removeAttr('style');// removeAttr style does not consistently work in safari
$sides.attr('style','').removeAttr('style');$side.attr('style','').removeAttr('style').removeClass(className.hidden);$nextSide.removeClass(className.animating).attr('style','').removeAttr('style');},is:{complete:function complete(){return $side.filter('.'+className.active)[0]==$nextSide[0];},animating:function animating(){return $module.hasClass(className.animating);}},set:{defaultSide:function defaultSide(){$activeSide=$module.find('.'+settings.className.active);$nextSide=$activeSide.next(selector.side).length>0?$activeSide.next(selector.side):$module.find(selector.side).first();nextIndex=false;module.verbose('Active side set to',$activeSide);module.verbose('Next side set to',$nextSide);},duration:function duration(_duration2){_duration2=_duration2||settings.duration;_duration2=typeof _duration2=='number'?_duration2+'ms':_duration2;module.verbose('Setting animation duration',_duration2);if(settings.duration||settings.duration===0){$sides.add($side).css({'-webkit-transition-duration':_duration2,'-moz-transition-duration':_duration2,'-ms-transition-duration':_duration2,'-o-transition-duration':_duration2,'transition-duration':_duration2});}},currentStageSize:function currentStageSize(){var $activeSide=$module.find('.'+settings.className.active),width=$activeSide.outerWidth(true),height=$activeSide.outerHeight(true);$module.css({width:width,height:height});},stageSize:function stageSize(){var $clone=$module.clone().addClass(className.loading),$activeSide=$clone.find('.'+settings.className.active),$nextSide=nextIndex?$clone.find(selector.side).eq(nextIndex):$activeSide.next(selector.side).length>0?$activeSide.next(selector.side):$clone.find(selector.side).first(),newWidth=settings.width=='next'?$nextSide.outerWidth(true):settings.width=='initial'?$module.width():settings.width,newHeight=settings.height=='next'?$nextSide.outerHeight(true):settings.height=='initial'?$module.height():settings.height;$activeSide.removeClass(className.active);$nextSide.addClass(className.active);$clone.insertAfter($module);$clone.remove();if(settings.width!='auto'){$module.css('width',newWidth+settings.jitter);module.verbose('Specifying width during animation',newWidth);}if(settings.height!='auto'){$module.css('height',newHeight+settings.jitter);module.verbose('Specifying height during animation',newHeight);}},nextSide:function nextSide(selector){nextIndex=selector;$nextSide=$side.filter(selector);nextIndex=$side.index($nextSide);if($nextSide.length===0){module.set.defaultSide();module.error(error.side);}module.verbose('Next side manually set to',$nextSide);},active:function active(){module.verbose('Setting new side to active',$nextSide);$side.removeClass(className.active);$nextSide.addClass(className.active);settings.onChange.call($nextSide[0]);module.set.defaultSide();}},flip:{up:function up(){if(module.is.complete()&&!module.is.animating()&&!settings.allowRepeats){module.debug('Side already visible',$nextSide);return;}if(!module.is.animating()){module.debug('Flipping up',$nextSide);var transform=module.get.transform.up();module.set.stageSize();module.stage.above();module.animate(transform);}else{module.queue('flip up');}},down:function down(){if(module.is.complete()&&!module.is.animating()&&!settings.allowRepeats){module.debug('Side already visible',$nextSide);return;}if(!module.is.animating()){module.debug('Flipping down',$nextSide);var transform=module.get.transform.down();module.set.stageSize();module.stage.below();module.animate(transform);}else{module.queue('flip down');}},left:function left(){if(module.is.complete()&&!module.is.animating()&&!settings.allowRepeats){module.debug('Side already visible',$nextSide);return;}if(!module.is.animating()){module.debug('Flipping left',$nextSide);var transform=module.get.transform.left();module.set.stageSize();module.stage.left();module.animate(transform);}else{module.queue('flip left');}},right:function right(){if(module.is.complete()&&!module.is.animating()&&!settings.allowRepeats){module.debug('Side already visible',$nextSide);return;}if(!module.is.animating()){module.debug('Flipping right',$nextSide);var transform=module.get.transform.right();module.set.stageSize();module.stage.right();module.animate(transform);}else{module.queue('flip right');}},over:function over(){if(module.is.complete()&&!module.is.animating()&&!settings.allowRepeats){module.debug('Side already visible',$nextSide);return;}if(!module.is.animating()){module.debug('Flipping over',$nextSide);module.set.stageSize();module.stage.behind();module.animate(module.get.transform.over());}else{module.queue('flip over');}},back:function back(){if(module.is.complete()&&!module.is.animating()&&!settings.allowRepeats){module.debug('Side already visible',$nextSide);return;}if(!module.is.animating()){module.debug('Flipping back',$nextSide);module.set.stageSize();module.stage.behind();module.animate(module.get.transform.back());}else{module.queue('flip back');}}},get:{transform:{up:function up(){var translate={y:-(($activeSide.outerHeight(true)-$nextSide.outerHeight(true))/2),z:-($activeSide.outerHeight(true)/2)};return{transform:'translateY('+translate.y+'px) translateZ('+translate.z+'px) rotateX(-90deg)'};},down:function down(){var translate={y:-(($activeSide.outerHeight(true)-$nextSide.outerHeight(true))/2),z:-($activeSide.outerHeight(true)/2)};return{transform:'translateY('+translate.y+'px) translateZ('+translate.z+'px) rotateX(90deg)'};},left:function left(){var translate={x:-(($activeSide.outerWidth(true)-$nextSide.outerWidth(true))/2),z:-($activeSide.outerWidth(true)/2)};return{transform:'translateX('+translate.x+'px) translateZ('+translate.z+'px) rotateY(90deg)'};},right:function right(){var translate={x:-(($activeSide.outerWidth(true)-$nextSide.outerWidth(true))/2),z:-($activeSide.outerWidth(true)/2)};return{transform:'translateX('+translate.x+'px) translateZ('+translate.z+'px) rotateY(-90deg)'};},over:function over(){var translate={x:-(($activeSide.outerWidth(true)-$nextSide.outerWidth(true))/2)};return{transform:'translateX('+translate.x+'px) rotateY(180deg)'};},back:function back(){var translate={x:-(($activeSide.outerWidth(true)-$nextSide.outerWidth(true))/2)};return{transform:'translateX('+translate.x+'px) rotateY(-180deg)'};}},transitionEvent:function transitionEvent(){var element=document.createElement('element'),transitions={'transition':'transitionend','OTransition':'oTransitionEnd','MozTransition':'transitionend','WebkitTransition':'webkitTransitionEnd'},transition;for(transition in transitions){if(element.style[transition]!==undefined){return transitions[transition];}}},nextSide:function nextSide(){return $activeSide.next(selector.side).length>0?$activeSide.next(selector.side):$module.find(selector.side).first();}},stage:{above:function above(){var box={origin:($activeSide.outerHeight(true)-$nextSide.outerHeight(true))/2,depth:{active:$nextSide.outerHeight(true)/2,next:$activeSide.outerHeight(true)/2}};module.verbose('Setting the initial animation position as above',$nextSide,box);$sides.css({'transform':'translateZ(-'+box.depth.active+'px)'});$activeSide.css({'transform':'rotateY(0deg) translateZ('+box.depth.active+'px)'});$nextSide.addClass(className.animating).css({'top':box.origin+'px','transform':'rotateX(90deg) translateZ('+box.depth.next+'px)'});},below:function below(){var box={origin:($activeSide.outerHeight(true)-$nextSide.outerHeight(true))/2,depth:{active:$nextSide.outerHeight(true)/2,next:$activeSide.outerHeight(true)/2}};module.verbose('Setting the initial animation position as below',$nextSide,box);$sides.css({'transform':'translateZ(-'+box.depth.active+'px)'});$activeSide.css({'transform':'rotateY(0deg) translateZ('+box.depth.active+'px)'});$nextSide.addClass(className.animating).css({'top':box.origin+'px','transform':'rotateX(-90deg) translateZ('+box.depth.next+'px)'});},left:function left(){var height={active:$activeSide.outerWidth(true),next:$nextSide.outerWidth(true)},box={origin:(height.active-height.next)/2,depth:{active:height.next/2,next:height.active/2}};module.verbose('Setting the initial animation position as left',$nextSide,box);$sides.css({'transform':'translateZ(-'+box.depth.active+'px)'});$activeSide.css({'transform':'rotateY(0deg) translateZ('+box.depth.active+'px)'});$nextSide.addClass(className.animating).css({'left':box.origin+'px','transform':'rotateY(-90deg) translateZ('+box.depth.next+'px)'});},right:function right(){var height={active:$activeSide.outerWidth(true),next:$nextSide.outerWidth(true)},box={origin:(height.active-height.next)/2,depth:{active:height.next/2,next:height.active/2}};module.verbose('Setting the initial animation position as left',$nextSide,box);$sides.css({'transform':'translateZ(-'+box.depth.active+'px)'});$activeSide.css({'transform':'rotateY(0deg) translateZ('+box.depth.active+'px)'});$nextSide.addClass(className.animating).css({'left':box.origin+'px','transform':'rotateY(90deg) translateZ('+box.depth.next+'px)'});},behind:function behind(){var height={active:$activeSide.outerWidth(true),next:$nextSide.outerWidth(true)},box={origin:(height.active-height.next)/2,depth:{active:height.next/2,next:height.active/2}};module.verbose('Setting the initial animation position as behind',$nextSide,box);$activeSide.css({'transform':'rotateY(0deg)'});$nextSide.addClass(className.animating).css({'left':box.origin+'px','transform':'rotateY(-180deg)'});}},setting:function setting(name,value){module.debug('Changing setting',name,value);if($.isPlainObject(name)){$.extend(true,settings,name);}else if(value!==undefined){if($.isPlainObject(settings[name])){$.extend(true,settings[name],value);}else{settings[name]=value;}}else{return settings[name];}},internal:function internal(name,value){if($.isPlainObject(name)){$.extend(true,module,name);}else if(value!==undefined){module[name]=value;}else{return module[name];}},debug:function debug(){if(!settings.silent&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.debug=Function.prototype.bind.call(console.info,console,settings.name+':');module.debug.apply(console,arguments);}}},verbose:function verbose(){if(!settings.silent&&settings.verbose&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.verbose=Function.prototype.bind.call(console.info,console,settings.name+':');module.verbose.apply(console,arguments);}}},error:function error(){if(!settings.silent){module.error=Function.prototype.bind.call(console.error,console,settings.name+':');module.error.apply(console,arguments);}},performance:{log:function log(message){var currentTime,executionTime,previousTime;if(settings.performance){currentTime=new Date().getTime();previousTime=time||currentTime;executionTime=currentTime-previousTime;time=currentTime;performance.push({'Name':message[0],'Arguments':[].slice.call(message,1)||'','Element':element,'Execution Time':executionTime});}clearTimeout(module.performance.timer);module.performance.timer=setTimeout(module.performance.display,500);},display:function display(){var title=settings.name+':',totalTime=0;time=false;clearTimeout(module.performance.timer);$.each(performance,function(index,data){totalTime+=data['Execution Time'];});title+=' '+totalTime+'ms';if(moduleSelector){title+=' \''+moduleSelector+'\'';}if($allModules.length>1){title+=' '+'('+$allModules.length+')';}if((console.group!==undefined||console.table!==undefined)&&performance.length>0){console.groupCollapsed(title);if(console.table){console.table(performance);}else{$.each(performance,function(index,data){console.log(data['Name']+': '+data['Execution Time']+'ms');});}console.groupEnd();}performance=[];}},invoke:function invoke(query,passedArguments,context){var object=instance,maxDepth,found,response;passedArguments=passedArguments||queryArguments;context=element||context;if(typeof query=='string'&&object!==undefined){query=query.split(/[\. ]/);maxDepth=query.length-1;$.each(query,function(depth,value){var camelCaseValue=depth!=maxDepth?value+query[depth+1].charAt(0).toUpperCase()+query[depth+1].slice(1):query;if($.isPlainObject(object[camelCaseValue])&&depth!=maxDepth){object=object[camelCaseValue];}else if(object[camelCaseValue]!==undefined){found=object[camelCaseValue];return false;}else if($.isPlainObject(object[value])&&depth!=maxDepth){object=object[value];}else if(object[value]!==undefined){found=object[value];return false;}else{return false;}});}if($.isFunction(found)){response=found.apply(context,passedArguments);}else if(found!==undefined){response=found;}if($.isArray(returnedValue)){returnedValue.push(response);}else if(returnedValue!==undefined){returnedValue=[returnedValue,response];}else if(response!==undefined){returnedValue=response;}return found;}};if(methodInvoked){if(instance===undefined){module.initialize();}module.invoke(query);}else{if(instance!==undefined){instance.invoke('destroy');}module.initialize();}});return returnedValue!==undefined?returnedValue:this;};$.fn.shape.settings={// module info
name:'Shape',// hide all debug content
silent:false,// debug content outputted to console
debug:false,// verbose debug output
verbose:false,// fudge factor in pixels when swapping from 2d to 3d (can be useful to correct rounding errors)
jitter:0,// performance data output
performance:true,// event namespace
namespace:'shape',// width during animation, can be set to 'auto', initial', 'next' or pixel amount
width:'initial',// height during animation, can be set to 'auto', 'initial', 'next' or pixel amount
height:'initial',// callback occurs on side change
beforeChange:function beforeChange(){},onChange:function onChange(){},// allow animation to same side
allowRepeats:false,// animation duration
duration:false,// possible errors
error:{side:'You tried to switch to a side that does not exist.',method:'The method you called is not defined'},// classnames used
className:{animating:'animating',hidden:'hidden',loading:'loading',active:'active'},// selectors used
selector:{sides:'.sides',side:'.side'}};})(jQuery,window,document);/*!
 * # Semantic UI 2.2.11 - Sidebar
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */;(function($,window,document,undefined){"use strict";window=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();$.fn.sidebar=function(parameters){var $allModules=$(this),$window=$(window),$document=$(document),$html=$('html'),$head=$('head'),moduleSelector=$allModules.selector||'',time=new Date().getTime(),performance=[],query=arguments[0],methodInvoked=typeof query=='string',queryArguments=[].slice.call(arguments,1),requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||function(callback){setTimeout(callback,0);},returnedValue;$allModules.each(function(){var settings=$.isPlainObject(parameters)?$.extend(true,{},$.fn.sidebar.settings,parameters):$.extend({},$.fn.sidebar.settings),selector=settings.selector,className=settings.className,namespace=settings.namespace,regExp=settings.regExp,error=settings.error,eventNamespace='.'+namespace,moduleNamespace='module-'+namespace,$module=$(this),$context=$(settings.context),$sidebars=$module.children(selector.sidebar),$fixed=$context.children(selector.fixed),$pusher=$context.children(selector.pusher),$style,element=this,instance=$module.data(moduleNamespace),elementNamespace,_id4,currentScroll,transitionEvent,module;module={initialize:function initialize(){module.debug('Initializing sidebar',parameters);module.create.id();transitionEvent=module.get.transitionEvent();// avoids locking rendering if initialized in onReady
if(settings.delaySetup){requestAnimationFrame(module.setup.layout);}else{module.setup.layout();}requestAnimationFrame(function(){module.setup.cache();});module.instantiate();},instantiate:function instantiate(){module.verbose('Storing instance of module',module);instance=module;$module.data(moduleNamespace,module);},create:{id:function id(){_id4=(Math.random().toString(16)+'000000000').substr(2,8);elementNamespace='.'+_id4;module.verbose('Creating unique id for element',_id4);}},destroy:function destroy(){module.verbose('Destroying previous module for',$module);$module.off(eventNamespace).removeData(moduleNamespace);if(module.is.ios()){module.remove.ios();}// bound by uuid
$context.off(elementNamespace);$window.off(elementNamespace);$document.off(elementNamespace);},event:{clickaway:function clickaway(event){var clickedInPusher=$pusher.find(event.target).length>0||$pusher.is(event.target),clickedContext=$context.is(event.target);if(clickedInPusher){module.verbose('User clicked on dimmed page');module.hide();}if(clickedContext){module.verbose('User clicked on dimmable context (scaled out page)');module.hide();}},touch:function touch(event){//event.stopPropagation();
},containScroll:function containScroll(event){if(element.scrollTop<=0){element.scrollTop=1;}if(element.scrollTop+element.offsetHeight>=element.scrollHeight){element.scrollTop=element.scrollHeight-element.offsetHeight-1;}},scroll:function scroll(event){if($(event.target).closest(selector.sidebar).length===0){event.preventDefault();}}},bind:{clickaway:function clickaway(){module.verbose('Adding clickaway events to context',$context);if(settings.closable){$context.on('click'+elementNamespace,module.event.clickaway).on('touchend'+elementNamespace,module.event.clickaway);}},scrollLock:function scrollLock(){if(settings.scrollLock){module.debug('Disabling page scroll');$window.on('DOMMouseScroll'+elementNamespace,module.event.scroll);}module.verbose('Adding events to contain sidebar scroll');$document.on('touchmove'+elementNamespace,module.event.touch);$module.on('scroll'+eventNamespace,module.event.containScroll);}},unbind:{clickaway:function clickaway(){module.verbose('Removing clickaway events from context',$context);$context.off(elementNamespace);},scrollLock:function scrollLock(){module.verbose('Removing scroll lock from page');$document.off(elementNamespace);$window.off(elementNamespace);$module.off('scroll'+eventNamespace);}},add:{inlineCSS:function inlineCSS(){var width=module.cache.width||$module.outerWidth(),height=module.cache.height||$module.outerHeight(),isRTL=module.is.rtl(),direction=module.get.direction(),distance={left:width,right:-width,top:height,bottom:-height},style;if(isRTL){module.verbose('RTL detected, flipping widths');distance.left=-width;distance.right=width;}style='<style>';if(direction==='left'||direction==='right'){module.debug('Adding CSS rules for animation distance',width);style+=''+' .ui.visible.'+direction+'.sidebar ~ .fixed,'+' .ui.visible.'+direction+'.sidebar ~ .pusher {'+'   -webkit-transform: translate3d('+distance[direction]+'px, 0, 0);'+'           transform: translate3d('+distance[direction]+'px, 0, 0);'+' }';}else if(direction==='top'||direction=='bottom'){style+=''+' .ui.visible.'+direction+'.sidebar ~ .fixed,'+' .ui.visible.'+direction+'.sidebar ~ .pusher {'+'   -webkit-transform: translate3d(0, '+distance[direction]+'px, 0);'+'           transform: translate3d(0, '+distance[direction]+'px, 0);'+' }';}/* IE is only browser not to create context with transforms *//* https://www.w3.org/Bugs/Public/show_bug.cgi?id=16328 */if(module.is.ie()){if(direction==='left'||direction==='right'){module.debug('Adding CSS rules for animation distance',width);style+=''+' body.pushable > .ui.visible.'+direction+'.sidebar ~ .pusher:after {'+'   -webkit-transform: translate3d('+distance[direction]+'px, 0, 0);'+'           transform: translate3d('+distance[direction]+'px, 0, 0);'+' }';}else if(direction==='top'||direction=='bottom'){style+=''+' body.pushable > .ui.visible.'+direction+'.sidebar ~ .pusher:after {'+'   -webkit-transform: translate3d(0, '+distance[direction]+'px, 0);'+'           transform: translate3d(0, '+distance[direction]+'px, 0);'+' }';}/* opposite sides visible forces content overlay */style+=''+' body.pushable > .ui.visible.left.sidebar ~ .ui.visible.right.sidebar ~ .pusher:after,'+' body.pushable > .ui.visible.right.sidebar ~ .ui.visible.left.sidebar ~ .pusher:after {'+'   -webkit-transform: translate3d(0px, 0, 0);'+'           transform: translate3d(0px, 0, 0);'+' }';}style+='</style>';$style=$(style).appendTo($head);module.debug('Adding sizing css to head',$style);}},refresh:function refresh(){module.verbose('Refreshing selector cache');$context=$(settings.context);$sidebars=$context.children(selector.sidebar);$pusher=$context.children(selector.pusher);$fixed=$context.children(selector.fixed);module.clear.cache();},refreshSidebars:function refreshSidebars(){module.verbose('Refreshing other sidebars');$sidebars=$context.children(selector.sidebar);},repaint:function repaint(){module.verbose('Forcing repaint event');element.style.display='none';var ignored=element.offsetHeight;element.scrollTop=element.scrollTop;element.style.display='';},setup:{cache:function cache(){module.cache={width:$module.outerWidth(),height:$module.outerHeight(),rtl:$module.css('direction')=='rtl'};},layout:function layout(){if($context.children(selector.pusher).length===0){module.debug('Adding wrapper element for sidebar');module.error(error.pusher);$pusher=$('<div class="pusher" />');$context.children().not(selector.omitted).not($sidebars).wrapAll($pusher);module.refresh();}if($module.nextAll(selector.pusher).length===0||$module.nextAll(selector.pusher)[0]!==$pusher[0]){module.debug('Moved sidebar to correct parent element');module.error(error.movedSidebar,element);$module.detach().prependTo($context);module.refresh();}module.clear.cache();module.set.pushable();module.set.direction();}},attachEvents:function attachEvents(selector,event){var $toggle=$(selector);event=$.isFunction(module[event])?module[event]:module.toggle;if($toggle.length>0){module.debug('Attaching sidebar events to element',selector,event);$toggle.on('click'+eventNamespace,event);}else{module.error(error.notFound,selector);}},show:function show(callback){callback=$.isFunction(callback)?callback:function(){};if(module.is.hidden()){module.refreshSidebars();if(settings.overlay){module.error(error.overlay);settings.transition='overlay';}module.refresh();if(module.othersActive()){module.debug('Other sidebars currently visible');if(settings.exclusive){// if not overlay queue animation after hide
if(settings.transition!='overlay'){module.hideOthers(module.show);return;}else{module.hideOthers();}}else{settings.transition='overlay';}}module.pushPage(function(){callback.call(element);settings.onShow.call(element);});settings.onChange.call(element);settings.onVisible.call(element);}else{module.debug('Sidebar is already visible');}},hide:function hide(callback){callback=$.isFunction(callback)?callback:function(){};if(module.is.visible()||module.is.animating()){module.debug('Hiding sidebar',callback);module.refreshSidebars();module.pullPage(function(){callback.call(element);settings.onHidden.call(element);});settings.onChange.call(element);settings.onHide.call(element);}},othersAnimating:function othersAnimating(){return $sidebars.not($module).filter('.'+className.animating).length>0;},othersVisible:function othersVisible(){return $sidebars.not($module).filter('.'+className.visible).length>0;},othersActive:function othersActive(){return module.othersVisible()||module.othersAnimating();},hideOthers:function hideOthers(callback){var $otherSidebars=$sidebars.not($module).filter('.'+className.visible),sidebarCount=$otherSidebars.length,callbackCount=0;callback=callback||function(){};$otherSidebars.sidebar('hide',function(){callbackCount++;if(callbackCount==sidebarCount){callback();}});},toggle:function toggle(){module.verbose('Determining toggled direction');if(module.is.hidden()){module.show();}else{module.hide();}},pushPage:function pushPage(callback){var transition=module.get.transition(),$transition=transition==='overlay'||module.othersActive()?$module:$pusher,animate,dim,_transitionEnd;callback=$.isFunction(callback)?callback:function(){};if(settings.transition=='scale down'){module.scrollToTop();}module.set.transition(transition);module.repaint();animate=function animate(){module.bind.clickaway();module.add.inlineCSS();module.set.animating();module.set.visible();};dim=function dim(){module.set.dimmed();};_transitionEnd=function transitionEnd(event){if(event.target==$transition[0]){$transition.off(transitionEvent+elementNamespace,_transitionEnd);module.remove.animating();module.bind.scrollLock();callback.call(element);}};$transition.off(transitionEvent+elementNamespace);$transition.on(transitionEvent+elementNamespace,_transitionEnd);requestAnimationFrame(animate);if(settings.dimPage&&!module.othersVisible()){requestAnimationFrame(dim);}},pullPage:function pullPage(callback){var transition=module.get.transition(),$transition=transition=='overlay'||module.othersActive()?$module:$pusher,animate,_transitionEnd2;callback=$.isFunction(callback)?callback:function(){};module.verbose('Removing context push state',module.get.direction());module.unbind.clickaway();module.unbind.scrollLock();animate=function animate(){module.set.transition(transition);module.set.animating();module.remove.visible();if(settings.dimPage&&!module.othersVisible()){$pusher.removeClass(className.dimmed);}};_transitionEnd2=function transitionEnd(event){if(event.target==$transition[0]){$transition.off(transitionEvent+elementNamespace,_transitionEnd2);module.remove.animating();module.remove.transition();module.remove.inlineCSS();if(transition=='scale down'||settings.returnScroll&&module.is.mobile()){module.scrollBack();}callback.call(element);}};$transition.off(transitionEvent+elementNamespace);$transition.on(transitionEvent+elementNamespace,_transitionEnd2);requestAnimationFrame(animate);},scrollToTop:function scrollToTop(){module.verbose('Scrolling to top of page to avoid animation issues');currentScroll=$(window).scrollTop();$module.scrollTop(0);window.scrollTo(0,0);},scrollBack:function scrollBack(){module.verbose('Scrolling back to original page position');window.scrollTo(0,currentScroll);},clear:{cache:function cache(){module.verbose('Clearing cached dimensions');module.cache={};}},set:{// ios only (scroll on html not document). This prevent auto-resize canvas/scroll in ios
// (This is no longer necessary in latest iOS)
ios:function ios(){$html.addClass(className.ios);},// container
pushed:function pushed(){$context.addClass(className.pushed);},pushable:function pushable(){$context.addClass(className.pushable);},// pusher
dimmed:function dimmed(){$pusher.addClass(className.dimmed);},// sidebar
active:function active(){$module.addClass(className.active);},animating:function animating(){$module.addClass(className.animating);},transition:function transition(_transition){_transition=_transition||module.get.transition();$module.addClass(_transition);},direction:function direction(_direction){_direction=_direction||module.get.direction();$module.addClass(className[_direction]);},visible:function visible(){$module.addClass(className.visible);},overlay:function overlay(){$module.addClass(className.overlay);}},remove:{inlineCSS:function inlineCSS(){module.debug('Removing inline css styles',$style);if($style&&$style.length>0){$style.remove();}},// ios scroll on html not document
ios:function ios(){$html.removeClass(className.ios);},// context
pushed:function pushed(){$context.removeClass(className.pushed);},pushable:function pushable(){$context.removeClass(className.pushable);},// sidebar
active:function active(){$module.removeClass(className.active);},animating:function animating(){$module.removeClass(className.animating);},transition:function transition(_transition2){_transition2=_transition2||module.get.transition();$module.removeClass(_transition2);},direction:function direction(_direction2){_direction2=_direction2||module.get.direction();$module.removeClass(className[_direction2]);},visible:function visible(){$module.removeClass(className.visible);},overlay:function overlay(){$module.removeClass(className.overlay);}},get:{direction:function direction(){if($module.hasClass(className.top)){return className.top;}else if($module.hasClass(className.right)){return className.right;}else if($module.hasClass(className.bottom)){return className.bottom;}return className.left;},transition:function transition(){var direction=module.get.direction(),transition;transition=module.is.mobile()?settings.mobileTransition=='auto'?settings.defaultTransition.mobile[direction]:settings.mobileTransition:settings.transition=='auto'?settings.defaultTransition.computer[direction]:settings.transition;module.verbose('Determined transition',transition);return transition;},transitionEvent:function transitionEvent(){var element=document.createElement('element'),transitions={'transition':'transitionend','OTransition':'oTransitionEnd','MozTransition':'transitionend','WebkitTransition':'webkitTransitionEnd'},transition;for(transition in transitions){if(element.style[transition]!==undefined){return transitions[transition];}}}},is:{ie:function ie(){var isIE11=!window.ActiveXObject&&'ActiveXObject'in window,isIE='ActiveXObject'in window;return isIE11||isIE;},ios:function ios(){var userAgent=navigator.userAgent,isIOS=userAgent.match(regExp.ios),isMobileChrome=userAgent.match(regExp.mobileChrome);if(isIOS&&!isMobileChrome){module.verbose('Browser was found to be iOS',userAgent);return true;}else{return false;}},mobile:function mobile(){var userAgent=navigator.userAgent,isMobile=userAgent.match(regExp.mobile);if(isMobile){module.verbose('Browser was found to be mobile',userAgent);return true;}else{module.verbose('Browser is not mobile, using regular transition',userAgent);return false;}},hidden:function hidden(){return!module.is.visible();},visible:function visible(){return $module.hasClass(className.visible);},// alias
open:function open(){return module.is.visible();},closed:function closed(){return module.is.hidden();},vertical:function vertical(){return $module.hasClass(className.top);},animating:function animating(){return $context.hasClass(className.animating);},rtl:function rtl(){if(module.cache.rtl===undefined){module.cache.rtl=$module.css('direction')=='rtl';}return module.cache.rtl;}},setting:function setting(name,value){module.debug('Changing setting',name,value);if($.isPlainObject(name)){$.extend(true,settings,name);}else if(value!==undefined){if($.isPlainObject(settings[name])){$.extend(true,settings[name],value);}else{settings[name]=value;}}else{return settings[name];}},internal:function internal(name,value){if($.isPlainObject(name)){$.extend(true,module,name);}else if(value!==undefined){module[name]=value;}else{return module[name];}},debug:function debug(){if(!settings.silent&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.debug=Function.prototype.bind.call(console.info,console,settings.name+':');module.debug.apply(console,arguments);}}},verbose:function verbose(){if(!settings.silent&&settings.verbose&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.verbose=Function.prototype.bind.call(console.info,console,settings.name+':');module.verbose.apply(console,arguments);}}},error:function error(){if(!settings.silent){module.error=Function.prototype.bind.call(console.error,console,settings.name+':');module.error.apply(console,arguments);}},performance:{log:function log(message){var currentTime,executionTime,previousTime;if(settings.performance){currentTime=new Date().getTime();previousTime=time||currentTime;executionTime=currentTime-previousTime;time=currentTime;performance.push({'Name':message[0],'Arguments':[].slice.call(message,1)||'','Element':element,'Execution Time':executionTime});}clearTimeout(module.performance.timer);module.performance.timer=setTimeout(module.performance.display,500);},display:function display(){var title=settings.name+':',totalTime=0;time=false;clearTimeout(module.performance.timer);$.each(performance,function(index,data){totalTime+=data['Execution Time'];});title+=' '+totalTime+'ms';if(moduleSelector){title+=' \''+moduleSelector+'\'';}if((console.group!==undefined||console.table!==undefined)&&performance.length>0){console.groupCollapsed(title);if(console.table){console.table(performance);}else{$.each(performance,function(index,data){console.log(data['Name']+': '+data['Execution Time']+'ms');});}console.groupEnd();}performance=[];}},invoke:function invoke(query,passedArguments,context){var object=instance,maxDepth,found,response;passedArguments=passedArguments||queryArguments;context=element||context;if(typeof query=='string'&&object!==undefined){query=query.split(/[\. ]/);maxDepth=query.length-1;$.each(query,function(depth,value){var camelCaseValue=depth!=maxDepth?value+query[depth+1].charAt(0).toUpperCase()+query[depth+1].slice(1):query;if($.isPlainObject(object[camelCaseValue])&&depth!=maxDepth){object=object[camelCaseValue];}else if(object[camelCaseValue]!==undefined){found=object[camelCaseValue];return false;}else if($.isPlainObject(object[value])&&depth!=maxDepth){object=object[value];}else if(object[value]!==undefined){found=object[value];return false;}else{module.error(error.method,query);return false;}});}if($.isFunction(found)){response=found.apply(context,passedArguments);}else if(found!==undefined){response=found;}if($.isArray(returnedValue)){returnedValue.push(response);}else if(returnedValue!==undefined){returnedValue=[returnedValue,response];}else if(response!==undefined){returnedValue=response;}return found;}};if(methodInvoked){if(instance===undefined){module.initialize();}module.invoke(query);}else{if(instance!==undefined){module.invoke('destroy');}module.initialize();}});return returnedValue!==undefined?returnedValue:this;};$.fn.sidebar.settings={name:'Sidebar',namespace:'sidebar',silent:false,debug:false,verbose:false,performance:true,transition:'auto',mobileTransition:'auto',defaultTransition:{computer:{left:'uncover',right:'uncover',top:'overlay',bottom:'overlay'},mobile:{left:'uncover',right:'uncover',top:'overlay',bottom:'overlay'}},context:'body',exclusive:false,closable:true,dimPage:true,scrollLock:false,returnScroll:false,delaySetup:false,duration:500,onChange:function onChange(){},onShow:function onShow(){},onHide:function onHide(){},onHidden:function onHidden(){},onVisible:function onVisible(){},className:{active:'active',animating:'animating',dimmed:'dimmed',ios:'ios',pushable:'pushable',pushed:'pushed',right:'right',top:'top',left:'left',bottom:'bottom',visible:'visible'},selector:{fixed:'.fixed',omitted:'script, link, style, .ui.modal, .ui.dimmer, .ui.nag, .ui.fixed',pusher:'.pusher',sidebar:'.ui.sidebar'},regExp:{ios:/(iPad|iPhone|iPod)/g,mobileChrome:/(CriOS)/g,mobile:/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/g},error:{method:'The method you called is not defined.',pusher:'Had to add pusher element. For optimal performance make sure body content is inside a pusher element',movedSidebar:'Had to move sidebar. For optimal performance make sure sidebar and pusher are direct children of your body tag',overlay:'The overlay setting is no longer supported, use animation: overlay',notFound:'There were no elements that matched the specified selector'}};})(jQuery,window,document);/*!
 * # Semantic UI 2.2.11 - Sticky
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */;(function($,window,document,undefined){"use strict";window=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();$.fn.sticky=function(parameters){var $allModules=$(this),moduleSelector=$allModules.selector||'',time=new Date().getTime(),performance=[],query=arguments[0],methodInvoked=typeof query=='string',queryArguments=[].slice.call(arguments,1),returnedValue;$allModules.each(function(){var settings=$.isPlainObject(parameters)?$.extend(true,{},$.fn.sticky.settings,parameters):$.extend({},$.fn.sticky.settings),className=settings.className,namespace=settings.namespace,error=settings.error,eventNamespace='.'+namespace,moduleNamespace='module-'+namespace,$module=$(this),$window=$(window),$scroll=$(settings.scrollContext),$container,$context,selector=$module.selector||'',instance=$module.data(moduleNamespace),requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||function(callback){setTimeout(callback,0);},element=this,documentObserver,observer,module;module={initialize:function initialize(){module.determineContainer();module.determineContext();module.verbose('Initializing sticky',settings,$container);module.save.positions();module.checkErrors();module.bind.events();if(settings.observeChanges){module.observeChanges();}module.instantiate();},instantiate:function instantiate(){module.verbose('Storing instance of module',module);instance=module;$module.data(moduleNamespace,module);},destroy:function destroy(){module.verbose('Destroying previous instance');module.reset();if(documentObserver){documentObserver.disconnect();}if(observer){observer.disconnect();}$window.off('load'+eventNamespace,module.event.load).off('resize'+eventNamespace,module.event.resize);$scroll.off('scrollchange'+eventNamespace,module.event.scrollchange);$module.removeData(moduleNamespace);},observeChanges:function observeChanges(){if('MutationObserver'in window){documentObserver=new MutationObserver(module.event.documentChanged);observer=new MutationObserver(module.event.changed);documentObserver.observe(document,{childList:true,subtree:true});observer.observe(element,{childList:true,subtree:true});observer.observe($context[0],{childList:true,subtree:true});module.debug('Setting up mutation observer',observer);}},determineContainer:function determineContainer(){if(settings.container){$container=$(settings.container);}else{$container=$module.offsetParent();}},determineContext:function determineContext(){if(settings.context){$context=$(settings.context);}else{$context=$container;}if($context.length===0){module.error(error.invalidContext,settings.context,$module);return;}},checkErrors:function checkErrors(){if(module.is.hidden()){module.error(error.visible,$module);}if(module.cache.element.height>module.cache.context.height){module.reset();module.error(error.elementSize,$module);return;}},bind:{events:function events(){$window.on('load'+eventNamespace,module.event.load).on('resize'+eventNamespace,module.event.resize);// pub/sub pattern
$scroll.off('scroll'+eventNamespace).on('scroll'+eventNamespace,module.event.scroll).on('scrollchange'+eventNamespace,module.event.scrollchange);}},event:{changed:function changed(mutations){clearTimeout(module.timer);module.timer=setTimeout(function(){module.verbose('DOM tree modified, updating sticky menu',mutations);module.refresh();},100);},documentChanged:function documentChanged(mutations){[].forEach.call(mutations,function(mutation){if(mutation.removedNodes){[].forEach.call(mutation.removedNodes,function(node){if(node==element||$(node).find(element).length>0){module.debug('Element removed from DOM, tearing down events');module.destroy();}});}});},load:function load(){module.verbose('Page contents finished loading');requestAnimationFrame(module.refresh);},resize:function resize(){module.verbose('Window resized');requestAnimationFrame(module.refresh);},scroll:function scroll(){requestAnimationFrame(function(){$scroll.triggerHandler('scrollchange'+eventNamespace,$scroll.scrollTop());});},scrollchange:function scrollchange(event,scrollPosition){module.stick(scrollPosition);settings.onScroll.call(element);}},refresh:function refresh(hardRefresh){module.reset();if(!settings.context){module.determineContext();}if(hardRefresh){module.determineContainer();}module.save.positions();module.stick();settings.onReposition.call(element);},supports:{sticky:function sticky(){var $element=$('<div/>'),element=$element[0];$element.addClass(className.supported);return $element.css('position').match('sticky');}},save:{lastScroll:function lastScroll(scroll){module.lastScroll=scroll;},elementScroll:function elementScroll(scroll){module.elementScroll=scroll;},positions:function positions(){var scrollContext={height:$scroll.height()},element={margin:{top:parseInt($module.css('margin-top'),10),bottom:parseInt($module.css('margin-bottom'),10)},offset:$module.offset(),width:$module.outerWidth(),height:$module.outerHeight()},context={offset:$context.offset(),height:$context.outerHeight()},container={height:$container.outerHeight()};if(!module.is.standardScroll()){module.debug('Non-standard scroll. Removing scroll offset from element offset');scrollContext.top=$scroll.scrollTop();scrollContext.left=$scroll.scrollLeft();element.offset.top+=scrollContext.top;context.offset.top+=scrollContext.top;element.offset.left+=scrollContext.left;context.offset.left+=scrollContext.left;}module.cache={fits:element.height+settings.offset<=scrollContext.height,sameHeight:element.height==context.height,scrollContext:{height:scrollContext.height},element:{margin:element.margin,top:element.offset.top-element.margin.top,left:element.offset.left,width:element.width,height:element.height,bottom:element.offset.top+element.height},context:{top:context.offset.top,height:context.height,bottom:context.offset.top+context.height}};module.set.containerSize();module.stick();module.debug('Caching element positions',module.cache);}},get:{direction:function direction(scroll){var direction='down';scroll=scroll||$scroll.scrollTop();if(module.lastScroll!==undefined){if(module.lastScroll<scroll){direction='down';}else if(module.lastScroll>scroll){direction='up';}}return direction;},scrollChange:function scrollChange(scroll){scroll=scroll||$scroll.scrollTop();return module.lastScroll?scroll-module.lastScroll:0;},currentElementScroll:function currentElementScroll(){if(module.elementScroll){return module.elementScroll;}return module.is.top()?Math.abs(parseInt($module.css('top'),10))||0:Math.abs(parseInt($module.css('bottom'),10))||0;},elementScroll:function elementScroll(scroll){scroll=scroll||$scroll.scrollTop();var element=module.cache.element,scrollContext=module.cache.scrollContext,delta=module.get.scrollChange(scroll),maxScroll=element.height-scrollContext.height+settings.offset,elementScroll=module.get.currentElementScroll(),possibleScroll=elementScroll+delta;if(module.cache.fits||possibleScroll<0){elementScroll=0;}else if(possibleScroll>maxScroll){elementScroll=maxScroll;}else{elementScroll=possibleScroll;}return elementScroll;}},remove:{lastScroll:function lastScroll(){delete module.lastScroll;},elementScroll:function elementScroll(scroll){delete module.elementScroll;},minimumSize:function minimumSize(){$container.css('min-height','');},offset:function offset(){$module.css('margin-top','');}},set:{offset:function offset(){module.verbose('Setting offset on element',settings.offset);$module.css('margin-top',settings.offset);},containerSize:function containerSize(){var tagName=$container.get(0).tagName;if(tagName==='HTML'||tagName=='body'){// this can trigger for too many reasons
//module.error(error.container, tagName, $module);
module.determineContainer();}else{if(Math.abs($container.outerHeight()-module.cache.context.height)>settings.jitter){module.debug('Context has padding, specifying exact height for container',module.cache.context.height);$container.css({height:module.cache.context.height});}}},minimumSize:function minimumSize(){var element=module.cache.element;$container.css('min-height',element.height);},scroll:function scroll(_scroll){module.debug('Setting scroll on element',_scroll);if(module.elementScroll==_scroll){return;}if(module.is.top()){$module.css('bottom','').css('top',-_scroll);}if(module.is.bottom()){$module.css('top','').css('bottom',_scroll);}},size:function size(){if(module.cache.element.height!==0&&module.cache.element.width!==0){element.style.setProperty('width',module.cache.element.width+'px','important');element.style.setProperty('height',module.cache.element.height+'px','important');}}},is:{standardScroll:function standardScroll(){return $scroll[0]==window;},top:function top(){return $module.hasClass(className.top);},bottom:function bottom(){return $module.hasClass(className.bottom);},initialPosition:function initialPosition(){return!module.is.fixed()&&!module.is.bound();},hidden:function hidden(){return!$module.is(':visible');},bound:function bound(){return $module.hasClass(className.bound);},fixed:function fixed(){return $module.hasClass(className.fixed);}},stick:function stick(scroll){var cachedPosition=scroll||$scroll.scrollTop(),cache=module.cache,fits=cache.fits,sameHeight=cache.sameHeight,element=cache.element,scrollContext=cache.scrollContext,context=cache.context,offset=module.is.bottom()&&settings.pushing?settings.bottomOffset:settings.offset,scroll={top:cachedPosition+offset,bottom:cachedPosition+offset+scrollContext.height},direction=module.get.direction(scroll.top),elementScroll=fits?0:module.get.elementScroll(scroll.top),// shorthand
doesntFit=!fits,elementVisible=element.height!==0;if(elementVisible&&!sameHeight){if(module.is.initialPosition()){if(scroll.top>=context.bottom){module.debug('Initial element position is bottom of container');module.bindBottom();}else if(scroll.top>element.top){if(element.height+scroll.top-elementScroll>=context.bottom){module.debug('Initial element position is bottom of container');module.bindBottom();}else{module.debug('Initial element position is fixed');module.fixTop();}}}else if(module.is.fixed()){// currently fixed top
if(module.is.top()){if(scroll.top<=element.top){module.debug('Fixed element reached top of container');module.setInitialPosition();}else if(element.height+scroll.top-elementScroll>=context.bottom){module.debug('Fixed element reached bottom of container');module.bindBottom();}// scroll element if larger than screen
else if(doesntFit){module.set.scroll(elementScroll);module.save.lastScroll(scroll.top);module.save.elementScroll(elementScroll);}}// currently fixed bottom
else if(module.is.bottom()){// top edge
if(scroll.bottom-element.height<=element.top){module.debug('Bottom fixed rail has reached top of container');module.setInitialPosition();}// bottom edge
else if(scroll.bottom>=context.bottom){module.debug('Bottom fixed rail has reached bottom of container');module.bindBottom();}// scroll element if larger than screen
else if(doesntFit){module.set.scroll(elementScroll);module.save.lastScroll(scroll.top);module.save.elementScroll(elementScroll);}}}else if(module.is.bottom()){if(scroll.top<=element.top){module.debug('Jumped from bottom fixed to top fixed, most likely used home/end button');module.setInitialPosition();}else{if(settings.pushing){if(module.is.bound()&&scroll.bottom<=context.bottom){module.debug('Fixing bottom attached element to bottom of browser.');module.fixBottom();}}else{if(module.is.bound()&&scroll.top<=context.bottom-element.height){module.debug('Fixing bottom attached element to top of browser.');module.fixTop();}}}}}},bindTop:function bindTop(){module.debug('Binding element to top of parent container');module.remove.offset();$module.css({left:'',top:'',marginBottom:''}).removeClass(className.fixed).removeClass(className.bottom).addClass(className.bound).addClass(className.top);settings.onTop.call(element);settings.onUnstick.call(element);},bindBottom:function bindBottom(){module.debug('Binding element to bottom of parent container');module.remove.offset();$module.css({left:'',top:''}).removeClass(className.fixed).removeClass(className.top).addClass(className.bound).addClass(className.bottom);settings.onBottom.call(element);settings.onUnstick.call(element);},setInitialPosition:function setInitialPosition(){module.debug('Returning to initial position');module.unfix();module.unbind();},fixTop:function fixTop(){module.debug('Fixing element to top of page');if(settings.setSize){module.set.size();}module.set.minimumSize();module.set.offset();$module.css({left:module.cache.element.left,bottom:'',marginBottom:''}).removeClass(className.bound).removeClass(className.bottom).addClass(className.fixed).addClass(className.top);settings.onStick.call(element);},fixBottom:function fixBottom(){module.debug('Sticking element to bottom of page');if(settings.setSize){module.set.size();}module.set.minimumSize();module.set.offset();$module.css({left:module.cache.element.left,bottom:'',marginBottom:''}).removeClass(className.bound).removeClass(className.top).addClass(className.fixed).addClass(className.bottom);settings.onStick.call(element);},unbind:function unbind(){if(module.is.bound()){module.debug('Removing container bound position on element');module.remove.offset();$module.removeClass(className.bound).removeClass(className.top).removeClass(className.bottom);}},unfix:function unfix(){if(module.is.fixed()){module.debug('Removing fixed position on element');module.remove.minimumSize();module.remove.offset();$module.removeClass(className.fixed).removeClass(className.top).removeClass(className.bottom);settings.onUnstick.call(element);}},reset:function reset(){module.debug('Resetting elements position');module.unbind();module.unfix();module.resetCSS();module.remove.offset();module.remove.lastScroll();},resetCSS:function resetCSS(){$module.css({width:'',height:''});$container.css({height:''});},setting:function setting(name,value){if($.isPlainObject(name)){$.extend(true,settings,name);}else if(value!==undefined){settings[name]=value;}else{return settings[name];}},internal:function internal(name,value){if($.isPlainObject(name)){$.extend(true,module,name);}else if(value!==undefined){module[name]=value;}else{return module[name];}},debug:function debug(){if(!settings.silent&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.debug=Function.prototype.bind.call(console.info,console,settings.name+':');module.debug.apply(console,arguments);}}},verbose:function verbose(){if(!settings.silent&&settings.verbose&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.verbose=Function.prototype.bind.call(console.info,console,settings.name+':');module.verbose.apply(console,arguments);}}},error:function error(){if(!settings.silent){module.error=Function.prototype.bind.call(console.error,console,settings.name+':');module.error.apply(console,arguments);}},performance:{log:function log(message){var currentTime,executionTime,previousTime;if(settings.performance){currentTime=new Date().getTime();previousTime=time||currentTime;executionTime=currentTime-previousTime;time=currentTime;performance.push({'Name':message[0],'Arguments':[].slice.call(message,1)||'','Element':element,'Execution Time':executionTime});}clearTimeout(module.performance.timer);module.performance.timer=setTimeout(module.performance.display,0);},display:function display(){var title=settings.name+':',totalTime=0;time=false;clearTimeout(module.performance.timer);$.each(performance,function(index,data){totalTime+=data['Execution Time'];});title+=' '+totalTime+'ms';if(moduleSelector){title+=' \''+moduleSelector+'\'';}if((console.group!==undefined||console.table!==undefined)&&performance.length>0){console.groupCollapsed(title);if(console.table){console.table(performance);}else{$.each(performance,function(index,data){console.log(data['Name']+': '+data['Execution Time']+'ms');});}console.groupEnd();}performance=[];}},invoke:function invoke(query,passedArguments,context){var object=instance,maxDepth,found,response;passedArguments=passedArguments||queryArguments;context=element||context;if(typeof query=='string'&&object!==undefined){query=query.split(/[\. ]/);maxDepth=query.length-1;$.each(query,function(depth,value){var camelCaseValue=depth!=maxDepth?value+query[depth+1].charAt(0).toUpperCase()+query[depth+1].slice(1):query;if($.isPlainObject(object[camelCaseValue])&&depth!=maxDepth){object=object[camelCaseValue];}else if(object[camelCaseValue]!==undefined){found=object[camelCaseValue];return false;}else if($.isPlainObject(object[value])&&depth!=maxDepth){object=object[value];}else if(object[value]!==undefined){found=object[value];return false;}else{return false;}});}if($.isFunction(found)){response=found.apply(context,passedArguments);}else if(found!==undefined){response=found;}if($.isArray(returnedValue)){returnedValue.push(response);}else if(returnedValue!==undefined){returnedValue=[returnedValue,response];}else if(response!==undefined){returnedValue=response;}return found;}};if(methodInvoked){if(instance===undefined){module.initialize();}module.invoke(query);}else{if(instance!==undefined){instance.invoke('destroy');}module.initialize();}});return returnedValue!==undefined?returnedValue:this;};$.fn.sticky.settings={name:'Sticky',namespace:'sticky',silent:false,debug:false,verbose:true,performance:true,// whether to stick in the opposite direction on scroll up
pushing:false,context:false,container:false,// Context to watch scroll events
scrollContext:window,// Offset to adjust scroll
offset:0,// Offset to adjust scroll when attached to bottom of screen
bottomOffset:0,// will only set container height if difference between context and container is larger than this number
jitter:5,// set width of sticky element when it is fixed to page (used to make sure 100% width is maintained if no fixed size set)
setSize:true,// Whether to automatically observe changes with Mutation Observers
observeChanges:false,// Called when position is recalculated
onReposition:function onReposition(){},// Called on each scroll
onScroll:function onScroll(){},// Called when element is stuck to viewport
onStick:function onStick(){},// Called when element is unstuck from viewport
onUnstick:function onUnstick(){},// Called when element reaches top of context
onTop:function onTop(){},// Called when element reaches bottom of context
onBottom:function onBottom(){},error:{container:'Sticky element must be inside a relative container',visible:'Element is hidden, you must call refresh after element becomes visible. Use silent setting to surpress this warning in production.',method:'The method you called is not defined.',invalidContext:'Context specified does not exist',elementSize:'Sticky element is larger than its container, cannot create sticky.'},className:{bound:'bound',fixed:'fixed',supported:'native',top:'top',bottom:'bottom'}};})(jQuery,window,document);/*!
 * # Semantic UI 2.2.11 - Tab
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */;(function($,window,document,undefined){"use strict";window=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();$.fn.tab=function(parameters){var// use window context if none specified
$allModules=$.isFunction(this)?$(window):$(this),moduleSelector=$allModules.selector||'',time=new Date().getTime(),performance=[],query=arguments[0],methodInvoked=typeof query=='string',queryArguments=[].slice.call(arguments,1),initializedHistory=false,returnedValue;$allModules.each(function(){var settings=$.isPlainObject(parameters)?$.extend(true,{},$.fn.tab.settings,parameters):$.extend({},$.fn.tab.settings),className=settings.className,metadata=settings.metadata,selector=settings.selector,error=settings.error,eventNamespace='.'+settings.namespace,moduleNamespace='module-'+settings.namespace,$module=$(this),$context,$tabs,cache={},firstLoad=true,recursionDepth=0,element=this,instance=$module.data(moduleNamespace),activeTabPath,parameterArray,module,historyEvent;module={initialize:function initialize(){module.debug('Initializing tab menu item',$module);module.fix.callbacks();module.determineTabs();module.debug('Determining tabs',settings.context,$tabs);// set up automatic routing
if(settings.auto){module.set.auto();}module.bind.events();if(settings.history&&!initializedHistory){module.initializeHistory();initializedHistory=true;}module.instantiate();},instantiate:function instantiate(){module.verbose('Storing instance of module',module);instance=module;$module.data(moduleNamespace,module);},destroy:function destroy(){module.debug('Destroying tabs',$module);$module.removeData(moduleNamespace).off(eventNamespace);},bind:{events:function events(){// if using $.tab don't add events
if(!$.isWindow(element)){module.debug('Attaching tab activation events to element',$module);$module.on('click'+eventNamespace,module.event.click);}}},determineTabs:function determineTabs(){var $reference;// determine tab context
if(settings.context==='parent'){if($module.closest(selector.ui).length>0){$reference=$module.closest(selector.ui);module.verbose('Using closest UI element as parent',$reference);}else{$reference=$module;}$context=$reference.parent();module.verbose('Determined parent element for creating context',$context);}else if(settings.context){$context=$(settings.context);module.verbose('Using selector for tab context',settings.context,$context);}else{$context=$('body');}// find tabs
if(settings.childrenOnly){$tabs=$context.children(selector.tabs);module.debug('Searching tab context children for tabs',$context,$tabs);}else{$tabs=$context.find(selector.tabs);module.debug('Searching tab context for tabs',$context,$tabs);}},fix:{callbacks:function callbacks(){if($.isPlainObject(parameters)&&(parameters.onTabLoad||parameters.onTabInit)){if(parameters.onTabLoad){parameters.onLoad=parameters.onTabLoad;delete parameters.onTabLoad;module.error(error.legacyLoad,parameters.onLoad);}if(parameters.onTabInit){parameters.onFirstLoad=parameters.onTabInit;delete parameters.onTabInit;module.error(error.legacyInit,parameters.onFirstLoad);}settings=$.extend(true,{},$.fn.tab.settings,parameters);}}},initializeHistory:function initializeHistory(){module.debug('Initializing page state');if($.address===undefined){module.error(error.state);return false;}else{if(settings.historyType=='state'){module.debug('Using HTML5 to manage state');if(settings.path!==false){$.address.history(true).state(settings.path);}else{module.error(error.path);return false;}}$.address.bind('change',module.event.history.change);}},event:{click:function click(event){var tabPath=$(this).data(metadata.tab);if(tabPath!==undefined){if(settings.history){module.verbose('Updating page state',event);$.address.value(tabPath);}else{module.verbose('Changing tab',event);module.changeTab(tabPath);}event.preventDefault();}else{module.debug('No tab specified');}},history:{change:function change(event){var tabPath=event.pathNames.join('/')||module.get.initialPath(),pageTitle=settings.templates.determineTitle(tabPath)||false;module.performance.display();module.debug('History change event',tabPath,event);historyEvent=event;if(tabPath!==undefined){module.changeTab(tabPath);}if(pageTitle){$.address.title(pageTitle);}}}},refresh:function refresh(){if(activeTabPath){module.debug('Refreshing tab',activeTabPath);module.changeTab(activeTabPath);}},cache:{read:function read(cacheKey){return cacheKey!==undefined?cache[cacheKey]:false;},add:function add(cacheKey,content){cacheKey=cacheKey||activeTabPath;module.debug('Adding cached content for',cacheKey);cache[cacheKey]=content;},remove:function remove(cacheKey){cacheKey=cacheKey||activeTabPath;module.debug('Removing cached content for',cacheKey);delete cache[cacheKey];}},set:{auto:function auto(){var url=typeof settings.path=='string'?settings.path.replace(/\/$/,'')+'/{$tab}':'/{$tab}';module.verbose('Setting up automatic tab retrieval from server',url);if($.isPlainObject(settings.apiSettings)){settings.apiSettings.url=url;}else{settings.apiSettings={url:url};}},loading:function loading(tabPath){var $tab=module.get.tabElement(tabPath),isLoading=$tab.hasClass(className.loading);if(!isLoading){module.verbose('Setting loading state for',$tab);$tab.addClass(className.loading).siblings($tabs).removeClass(className.active+' '+className.loading);if($tab.length>0){settings.onRequest.call($tab[0],tabPath);}}},state:function state(_state){$.address.value(_state);}},changeTab:function changeTab(tabPath){var pushStateAvailable=window.history&&window.history.pushState,shouldIgnoreLoad=pushStateAvailable&&settings.ignoreFirstLoad&&firstLoad,remoteContent=settings.auto||$.isPlainObject(settings.apiSettings),// only add default path if not remote content
pathArray=remoteContent&&!shouldIgnoreLoad?module.utilities.pathToArray(tabPath):module.get.defaultPathArray(tabPath);tabPath=module.utilities.arrayToPath(pathArray);$.each(pathArray,function(index,tab){var currentPathArray=pathArray.slice(0,index+1),currentPath=module.utilities.arrayToPath(currentPathArray),isTab=module.is.tab(currentPath),isLastIndex=index+1==pathArray.length,$tab=module.get.tabElement(currentPath),$anchor,nextPathArray,nextPath,isLastTab;module.verbose('Looking for tab',tab);if(isTab){module.verbose('Tab was found',tab);// scope up
activeTabPath=currentPath;parameterArray=module.utilities.filterArray(pathArray,currentPathArray);if(isLastIndex){isLastTab=true;}else{nextPathArray=pathArray.slice(0,index+2);nextPath=module.utilities.arrayToPath(nextPathArray);isLastTab=!module.is.tab(nextPath);if(isLastTab){module.verbose('Tab parameters found',nextPathArray);}}if(isLastTab&&remoteContent){if(!shouldIgnoreLoad){module.activate.navigation(currentPath);module.fetch.content(currentPath,tabPath);}else{module.debug('Ignoring remote content on first tab load',currentPath);firstLoad=false;module.cache.add(tabPath,$tab.html());module.activate.all(currentPath);settings.onFirstLoad.call($tab[0],currentPath,parameterArray,historyEvent);settings.onLoad.call($tab[0],currentPath,parameterArray,historyEvent);}return false;}else{module.debug('Opened local tab',currentPath);module.activate.all(currentPath);if(!module.cache.read(currentPath)){module.cache.add(currentPath,true);module.debug('First time tab loaded calling tab init');settings.onFirstLoad.call($tab[0],currentPath,parameterArray,historyEvent);}settings.onLoad.call($tab[0],currentPath,parameterArray,historyEvent);}}else if(tabPath.search('/')==-1&&tabPath!==''){// look for in page anchor
$anchor=$('#'+tabPath+', a[name="'+tabPath+'"]');currentPath=$anchor.closest('[data-tab]').data(metadata.tab);$tab=module.get.tabElement(currentPath);// if anchor exists use parent tab
if($anchor&&$anchor.length>0&&currentPath){module.debug('Anchor link used, opening parent tab',$tab,$anchor);if(!$tab.hasClass(className.active)){setTimeout(function(){module.scrollTo($anchor);},0);}module.activate.all(currentPath);if(!module.cache.read(currentPath)){module.cache.add(currentPath,true);module.debug('First time tab loaded calling tab init');settings.onFirstLoad.call($tab[0],currentPath,parameterArray,historyEvent);}settings.onLoad.call($tab[0],currentPath,parameterArray,historyEvent);return false;}}else{module.error(error.missingTab,$module,$context,currentPath);return false;}});},scrollTo:function scrollTo($element){var scrollOffset=$element&&$element.length>0?$element.offset().top:false;if(scrollOffset!==false){module.debug('Forcing scroll to an in-page link in a hidden tab',scrollOffset,$element);$(document).scrollTop(scrollOffset);}},update:{content:function content(tabPath,html,evaluateScripts){var $tab=module.get.tabElement(tabPath),tab=$tab[0];evaluateScripts=evaluateScripts!==undefined?evaluateScripts:settings.evaluateScripts;if(typeof settings.cacheType=='string'&&settings.cacheType.toLowerCase()=='dom'&&typeof html!=='string'){$tab.empty().append($(html).clone(true));}else{if(evaluateScripts){module.debug('Updating HTML and evaluating inline scripts',tabPath,html);$tab.html(html);}else{module.debug('Updating HTML',tabPath,html);tab.innerHTML=html;}}}},fetch:{content:function content(tabPath,fullTabPath){var $tab=module.get.tabElement(tabPath),apiSettings={dataType:'html',encodeParameters:false,on:'now',cache:settings.alwaysRefresh,headers:{'X-Remote':true},onSuccess:function onSuccess(response){if(settings.cacheType=='response'){module.cache.add(fullTabPath,response);}module.update.content(tabPath,response);if(tabPath==activeTabPath){module.debug('Content loaded',tabPath);module.activate.tab(tabPath);}else{module.debug('Content loaded in background',tabPath);}settings.onFirstLoad.call($tab[0],tabPath,parameterArray,historyEvent);settings.onLoad.call($tab[0],tabPath,parameterArray,historyEvent);if(settings.loadOnce){module.cache.add(fullTabPath,true);}else if(typeof settings.cacheType=='string'&&settings.cacheType.toLowerCase()=='dom'&&$tab.children().length>0){setTimeout(function(){var $clone=$tab.children().clone(true);$clone=$clone.not('script');module.cache.add(fullTabPath,$clone);},0);}else{module.cache.add(fullTabPath,$tab.html());}},urlData:{tab:fullTabPath}},request=$tab.api('get request')||false,existingRequest=request&&request.state()==='pending',requestSettings,cachedContent;fullTabPath=fullTabPath||tabPath;cachedContent=module.cache.read(fullTabPath);if(settings.cache&&cachedContent){module.activate.tab(tabPath);module.debug('Adding cached content',fullTabPath);if(!settings.loadOnce){if(settings.evaluateScripts=='once'){module.update.content(tabPath,cachedContent,false);}else{module.update.content(tabPath,cachedContent);}}settings.onLoad.call($tab[0],tabPath,parameterArray,historyEvent);}else if(existingRequest){module.set.loading(tabPath);module.debug('Content is already loading',fullTabPath);}else if($.api!==undefined){requestSettings=$.extend(true,{},settings.apiSettings,apiSettings);module.debug('Retrieving remote content',fullTabPath,requestSettings);module.set.loading(tabPath);$tab.api(requestSettings);}else{module.error(error.api);}}},activate:{all:function all(tabPath){module.activate.tab(tabPath);module.activate.navigation(tabPath);},tab:function tab(tabPath){var $tab=module.get.tabElement(tabPath),$deactiveTabs=settings.deactivate=='siblings'?$tab.siblings($tabs):$tabs.not($tab),isActive=$tab.hasClass(className.active);module.verbose('Showing tab content for',$tab);if(!isActive){$tab.addClass(className.active);$deactiveTabs.removeClass(className.active+' '+className.loading);if($tab.length>0){settings.onVisible.call($tab[0],tabPath);}}},navigation:function navigation(tabPath){var $navigation=module.get.navElement(tabPath),$deactiveNavigation=settings.deactivate=='siblings'?$navigation.siblings($allModules):$allModules.not($navigation),isActive=$navigation.hasClass(className.active);module.verbose('Activating tab navigation for',$navigation,tabPath);if(!isActive){$navigation.addClass(className.active);$deactiveNavigation.removeClass(className.active+' '+className.loading);}}},deactivate:{all:function all(){module.deactivate.navigation();module.deactivate.tabs();},navigation:function navigation(){$allModules.removeClass(className.active);},tabs:function tabs(){$tabs.removeClass(className.active+' '+className.loading);}},is:{tab:function tab(tabName){return tabName!==undefined?module.get.tabElement(tabName).length>0:false;}},get:{initialPath:function initialPath(){return $allModules.eq(0).data(metadata.tab)||$tabs.eq(0).data(metadata.tab);},path:function path(){return $.address.value();},// adds default tabs to tab path
defaultPathArray:function defaultPathArray(tabPath){return module.utilities.pathToArray(module.get.defaultPath(tabPath));},defaultPath:function defaultPath(tabPath){var $defaultNav=$allModules.filter('[data-'+metadata.tab+'^="'+tabPath+'/"]').eq(0),defaultTab=$defaultNav.data(metadata.tab)||false;if(defaultTab){module.debug('Found default tab',defaultTab);if(recursionDepth<settings.maxDepth){recursionDepth++;return module.get.defaultPath(defaultTab);}module.error(error.recursion);}else{module.debug('No default tabs found for',tabPath,$tabs);}recursionDepth=0;return tabPath;},navElement:function navElement(tabPath){tabPath=tabPath||activeTabPath;return $allModules.filter('[data-'+metadata.tab+'="'+tabPath+'"]');},tabElement:function tabElement(tabPath){var $fullPathTab,$simplePathTab,tabPathArray,lastTab;tabPath=tabPath||activeTabPath;tabPathArray=module.utilities.pathToArray(tabPath);lastTab=module.utilities.last(tabPathArray);$fullPathTab=$tabs.filter('[data-'+metadata.tab+'="'+tabPath+'"]');$simplePathTab=$tabs.filter('[data-'+metadata.tab+'="'+lastTab+'"]');return $fullPathTab.length>0?$fullPathTab:$simplePathTab;},tab:function tab(){return activeTabPath;}},utilities:{filterArray:function filterArray(keepArray,removeArray){return $.grep(keepArray,function(keepValue){return $.inArray(keepValue,removeArray)==-1;});},last:function last(array){return $.isArray(array)?array[array.length-1]:false;},pathToArray:function pathToArray(pathName){if(pathName===undefined){pathName=activeTabPath;}return typeof pathName=='string'?pathName.split('/'):[pathName];},arrayToPath:function arrayToPath(pathArray){return $.isArray(pathArray)?pathArray.join('/'):false;}},setting:function setting(name,value){module.debug('Changing setting',name,value);if($.isPlainObject(name)){$.extend(true,settings,name);}else if(value!==undefined){if($.isPlainObject(settings[name])){$.extend(true,settings[name],value);}else{settings[name]=value;}}else{return settings[name];}},internal:function internal(name,value){if($.isPlainObject(name)){$.extend(true,module,name);}else if(value!==undefined){module[name]=value;}else{return module[name];}},debug:function debug(){if(!settings.silent&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.debug=Function.prototype.bind.call(console.info,console,settings.name+':');module.debug.apply(console,arguments);}}},verbose:function verbose(){if(!settings.silent&&settings.verbose&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.verbose=Function.prototype.bind.call(console.info,console,settings.name+':');module.verbose.apply(console,arguments);}}},error:function error(){if(!settings.silent){module.error=Function.prototype.bind.call(console.error,console,settings.name+':');module.error.apply(console,arguments);}},performance:{log:function log(message){var currentTime,executionTime,previousTime;if(settings.performance){currentTime=new Date().getTime();previousTime=time||currentTime;executionTime=currentTime-previousTime;time=currentTime;performance.push({'Name':message[0],'Arguments':[].slice.call(message,1)||'','Element':element,'Execution Time':executionTime});}clearTimeout(module.performance.timer);module.performance.timer=setTimeout(module.performance.display,500);},display:function display(){var title=settings.name+':',totalTime=0;time=false;clearTimeout(module.performance.timer);$.each(performance,function(index,data){totalTime+=data['Execution Time'];});title+=' '+totalTime+'ms';if(moduleSelector){title+=' \''+moduleSelector+'\'';}if((console.group!==undefined||console.table!==undefined)&&performance.length>0){console.groupCollapsed(title);if(console.table){console.table(performance);}else{$.each(performance,function(index,data){console.log(data['Name']+': '+data['Execution Time']+'ms');});}console.groupEnd();}performance=[];}},invoke:function invoke(query,passedArguments,context){var object=instance,maxDepth,found,response;passedArguments=passedArguments||queryArguments;context=element||context;if(typeof query=='string'&&object!==undefined){query=query.split(/[\. ]/);maxDepth=query.length-1;$.each(query,function(depth,value){var camelCaseValue=depth!=maxDepth?value+query[depth+1].charAt(0).toUpperCase()+query[depth+1].slice(1):query;if($.isPlainObject(object[camelCaseValue])&&depth!=maxDepth){object=object[camelCaseValue];}else if(object[camelCaseValue]!==undefined){found=object[camelCaseValue];return false;}else if($.isPlainObject(object[value])&&depth!=maxDepth){object=object[value];}else if(object[value]!==undefined){found=object[value];return false;}else{module.error(error.method,query);return false;}});}if($.isFunction(found)){response=found.apply(context,passedArguments);}else if(found!==undefined){response=found;}if($.isArray(returnedValue)){returnedValue.push(response);}else if(returnedValue!==undefined){returnedValue=[returnedValue,response];}else if(response!==undefined){returnedValue=response;}return found;}};if(methodInvoked){if(instance===undefined){module.initialize();}module.invoke(query);}else{if(instance!==undefined){instance.invoke('destroy');}module.initialize();}});return returnedValue!==undefined?returnedValue:this;};// shortcut for tabbed content with no defined navigation
$.tab=function(){$(window).tab.apply(this,arguments);};$.fn.tab.settings={name:'Tab',namespace:'tab',silent:false,debug:false,verbose:false,performance:true,auto:false,// uses pjax style endpoints fetching content from same url with remote-content headers
history:false,// use browser history
historyType:'hash',// #/ or html5 state
path:false,// base path of url
context:false,// specify a context that tabs must appear inside
childrenOnly:false,// use only tabs that are children of context
maxDepth:25,// max depth a tab can be nested
deactivate:'siblings',// whether tabs should deactivate sibling menu elements or all elements initialized together
alwaysRefresh:false,// load tab content new every tab click
cache:true,// cache the content requests to pull locally
loadOnce:false,// Whether tab data should only be loaded once when using remote content
cacheType:'response',// Whether to cache exact response, or to html cache contents after scripts execute
ignoreFirstLoad:false,// don't load remote content on first load
apiSettings:false,// settings for api call
evaluateScripts:'once',// whether inline scripts should be parsed (true/false/once). Once will not re-evaluate on cached content
onFirstLoad:function onFirstLoad(tabPath,parameterArray,historyEvent){},// called first time loaded
onLoad:function onLoad(tabPath,parameterArray,historyEvent){},// called on every load
onVisible:function onVisible(tabPath,parameterArray,historyEvent){},// called every time tab visible
onRequest:function onRequest(tabPath,parameterArray,historyEvent){},// called ever time a tab beings loading remote content
templates:{determineTitle:function determineTitle(tabArray){}// returns page title for path
},error:{api:'You attempted to load content without API module',method:'The method you called is not defined',missingTab:'Activated tab cannot be found. Tabs are case-sensitive.',noContent:'The tab you specified is missing a content url.',path:'History enabled, but no path was specified',recursion:'Max recursive depth reached',legacyInit:'onTabInit has been renamed to onFirstLoad in 2.0, please adjust your code.',legacyLoad:'onTabLoad has been renamed to onLoad in 2.0. Please adjust your code',state:'History requires Asual\'s Address library <https://github.com/asual/jquery-address>'},metadata:{tab:'tab',loaded:'loaded',promise:'promise'},className:{loading:'loading',active:'active'},selector:{tabs:'.ui.tab',ui:'.ui'}};})(jQuery,window,document);/*!
 * # Semantic UI 2.2.11 - Transition
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */;(function($,window,document,undefined){"use strict";window=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();$.fn.transition=function(){var $allModules=$(this),moduleSelector=$allModules.selector||'',time=new Date().getTime(),performance=[],moduleArguments=arguments,query=moduleArguments[0],queryArguments=[].slice.call(arguments,1),methodInvoked=typeof query==='string',requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||function(callback){setTimeout(callback,0);},returnedValue;$allModules.each(function(index){var $module=$(this),element=this,// set at run time
settings,instance,error,className,metadata,animationEnd,animationName,namespace,moduleNamespace,eventNamespace,module;module={initialize:function initialize(){// get full settings
settings=module.get.settings.apply(element,moduleArguments);// shorthand
className=settings.className;error=settings.error;metadata=settings.metadata;// define namespace
eventNamespace='.'+settings.namespace;moduleNamespace='module-'+settings.namespace;instance=$module.data(moduleNamespace)||module;// get vendor specific events
animationEnd=module.get.animationEndEvent();if(methodInvoked){methodInvoked=module.invoke(query);}// method not invoked, lets run an animation
if(methodInvoked===false){module.verbose('Converted arguments into settings object',settings);if(settings.interval){module.delay(settings.animate);}else{module.animate();}module.instantiate();}},instantiate:function instantiate(){module.verbose('Storing instance of module',module);instance=module;$module.data(moduleNamespace,instance);},destroy:function destroy(){module.verbose('Destroying previous module for',element);$module.removeData(moduleNamespace);},refresh:function refresh(){module.verbose('Refreshing display type on next animation');delete module.displayType;},forceRepaint:function forceRepaint(){module.verbose('Forcing element repaint');var $parentElement=$module.parent(),$nextElement=$module.next();if($nextElement.length===0){$module.detach().appendTo($parentElement);}else{$module.detach().insertBefore($nextElement);}},repaint:function repaint(){module.verbose('Repainting element');var fakeAssignment=element.offsetWidth;},delay:function delay(interval){var direction=module.get.animationDirection(),shouldReverse,delay;if(!direction){direction=module.can.transition()?module.get.direction():'static';}interval=interval!==undefined?interval:settings.interval;shouldReverse=settings.reverse=='auto'&&direction==className.outward;delay=shouldReverse||settings.reverse==true?($allModules.length-index)*settings.interval:index*settings.interval;module.debug('Delaying animation by',delay);setTimeout(module.animate,delay);},animate:function animate(overrideSettings){settings=overrideSettings||settings;if(!module.is.supported()){module.error(error.support);return false;}module.debug('Preparing animation',settings.animation);if(module.is.animating()){if(settings.queue){if(!settings.allowRepeats&&module.has.direction()&&module.is.occurring()&&module.queuing!==true){module.debug('Animation is currently occurring, preventing queueing same animation',settings.animation);}else{module.queue(settings.animation);}return false;}else if(!settings.allowRepeats&&module.is.occurring()){module.debug('Animation is already occurring, will not execute repeated animation',settings.animation);return false;}else{module.debug('New animation started, completing previous early',settings.animation);instance.complete();}}if(module.can.animate()){module.set.animating(settings.animation);}else{module.error(error.noAnimation,settings.animation,element);}},reset:function reset(){module.debug('Resetting animation to beginning conditions');module.remove.animationCallbacks();module.restore.conditions();module.remove.animating();},queue:function queue(animation){module.debug('Queueing animation of',animation);module.queuing=true;$module.one(animationEnd+'.queue'+eventNamespace,function(){module.queuing=false;module.repaint();module.animate.apply(this,settings);});},complete:function complete(event){module.debug('Animation complete',settings.animation);module.remove.completeCallback();module.remove.failSafe();if(!module.is.looping()){if(module.is.outward()){module.verbose('Animation is outward, hiding element');module.restore.conditions();module.hide();}else if(module.is.inward()){module.verbose('Animation is outward, showing element');module.restore.conditions();module.show();}else{module.verbose('Static animation completed');module.restore.conditions();settings.onComplete.call(element);}}},force:{visible:function visible(){var style=$module.attr('style'),userStyle=module.get.userStyle(),displayType=module.get.displayType(),overrideStyle=userStyle+'display: '+displayType+' !important;',currentDisplay=$module.css('display'),emptyStyle=style===undefined||style==='';if(currentDisplay!==displayType){module.verbose('Overriding default display to show element',displayType);$module.attr('style',overrideStyle);}else if(emptyStyle){$module.removeAttr('style');}},hidden:function hidden(){var style=$module.attr('style'),currentDisplay=$module.css('display'),emptyStyle=style===undefined||style==='';if(currentDisplay!=='none'&&!module.is.hidden()){module.verbose('Overriding default display to hide element');$module.css('display','none');}else if(emptyStyle){$module.removeAttr('style');}}},has:{direction:function direction(animation){var hasDirection=false;animation=animation||settings.animation;if(typeof animation==='string'){animation=animation.split(' ');$.each(animation,function(index,word){if(word===className.inward||word===className.outward){hasDirection=true;}});}return hasDirection;},inlineDisplay:function inlineDisplay(){var style=$module.attr('style')||'';return $.isArray(style.match(/display.*?;/,''));}},set:{animating:function animating(animation){var animationClass,direction;// remove previous callbacks
module.remove.completeCallback();// determine exact animation
animation=animation||settings.animation;animationClass=module.get.animationClass(animation);// save animation class in cache to restore class names
module.save.animation(animationClass);// override display if necessary so animation appears visibly
module.force.visible();module.remove.hidden();module.remove.direction();module.start.animation(animationClass);},duration:function duration(animationName,_duration3){_duration3=_duration3||settings.duration;_duration3=typeof _duration3=='number'?_duration3+'ms':_duration3;if(_duration3||_duration3===0){module.verbose('Setting animation duration',_duration3);$module.css({'animation-duration':_duration3});}},direction:function direction(_direction3){_direction3=_direction3||module.get.direction();if(_direction3==className.inward){module.set.inward();}else{module.set.outward();}},looping:function looping(){module.debug('Transition set to loop');$module.addClass(className.looping);},hidden:function hidden(){$module.addClass(className.transition).addClass(className.hidden);},inward:function inward(){module.debug('Setting direction to inward');$module.removeClass(className.outward).addClass(className.inward);},outward:function outward(){module.debug('Setting direction to outward');$module.removeClass(className.inward).addClass(className.outward);},visible:function visible(){$module.addClass(className.transition).addClass(className.visible);}},start:{animation:function animation(animationClass){animationClass=animationClass||module.get.animationClass();module.debug('Starting tween',animationClass);$module.addClass(animationClass).one(animationEnd+'.complete'+eventNamespace,module.complete);if(settings.useFailSafe){module.add.failSafe();}module.set.duration(settings.duration);settings.onStart.call(element);}},save:{animation:function animation(_animation){if(!module.cache){module.cache={};}module.cache.animation=_animation;},displayType:function displayType(_displayType){if(_displayType!=='none'){$module.data(metadata.displayType,_displayType);}},transitionExists:function transitionExists(animation,exists){$.fn.transition.exists[animation]=exists;module.verbose('Saving existence of transition',animation,exists);}},restore:{conditions:function conditions(){var animation=module.get.currentAnimation();if(animation){$module.removeClass(animation);module.verbose('Removing animation class',module.cache);}module.remove.duration();}},add:{failSafe:function failSafe(){var duration=module.get.duration();module.timer=setTimeout(function(){$module.triggerHandler(animationEnd);},duration+settings.failSafeDelay);module.verbose('Adding fail safe timer',module.timer);}},remove:{animating:function animating(){$module.removeClass(className.animating);},animationCallbacks:function animationCallbacks(){module.remove.queueCallback();module.remove.completeCallback();},queueCallback:function queueCallback(){$module.off('.queue'+eventNamespace);},completeCallback:function completeCallback(){$module.off('.complete'+eventNamespace);},display:function display(){$module.css('display','');},direction:function direction(){$module.removeClass(className.inward).removeClass(className.outward);},duration:function duration(){$module.css('animation-duration','');},failSafe:function failSafe(){module.verbose('Removing fail safe timer',module.timer);if(module.timer){clearTimeout(module.timer);}},hidden:function hidden(){$module.removeClass(className.hidden);},visible:function visible(){$module.removeClass(className.visible);},looping:function looping(){module.debug('Transitions are no longer looping');if(module.is.looping()){module.reset();$module.removeClass(className.looping);}},transition:function transition(){$module.removeClass(className.visible).removeClass(className.hidden);}},get:{settings:function settings(animation,duration,onComplete){// single settings object
if((typeof animation==='undefined'?'undefined':_typeof(animation))=='object'){return $.extend(true,{},$.fn.transition.settings,animation);}// all arguments provided
else if(typeof onComplete=='function'){return $.extend({},$.fn.transition.settings,{animation:animation,onComplete:onComplete,duration:duration});}// only duration provided
else if(typeof duration=='string'||typeof duration=='number'){return $.extend({},$.fn.transition.settings,{animation:animation,duration:duration});}// duration is actually settings object
else if((typeof duration==='undefined'?'undefined':_typeof(duration))=='object'){return $.extend({},$.fn.transition.settings,duration,{animation:animation});}// duration is actually callback
else if(typeof duration=='function'){return $.extend({},$.fn.transition.settings,{animation:animation,onComplete:duration});}// only animation provided
else{return $.extend({},$.fn.transition.settings,{animation:animation});}},animationClass:function animationClass(animation){var animationClass=animation||settings.animation,directionClass=module.can.transition()&&!module.has.direction()?module.get.direction()+' ':'';return className.animating+' '+className.transition+' '+directionClass+animationClass;},currentAnimation:function currentAnimation(){return module.cache&&module.cache.animation!==undefined?module.cache.animation:false;},currentDirection:function currentDirection(){return module.is.inward()?className.inward:className.outward;},direction:function direction(){return module.is.hidden()||!module.is.visible()?className.inward:className.outward;},animationDirection:function animationDirection(animation){var direction;animation=animation||settings.animation;if(typeof animation==='string'){animation=animation.split(' ');// search animation name for out/in class
$.each(animation,function(index,word){if(word===className.inward){direction=className.inward;}else if(word===className.outward){direction=className.outward;}});}// return found direction
if(direction){return direction;}return false;},duration:function duration(_duration4){_duration4=_duration4||settings.duration;if(_duration4===false){_duration4=$module.css('animation-duration')||0;}return typeof _duration4==='string'?_duration4.indexOf('ms')>-1?parseFloat(_duration4):parseFloat(_duration4)*1000:_duration4;},displayType:function displayType(shouldDetermine){shouldDetermine=shouldDetermine!==undefined?shouldDetermine:true;if(settings.displayType){return settings.displayType;}if(shouldDetermine&&$module.data(metadata.displayType)===undefined){// create fake element to determine display state
module.can.transition(true);}return $module.data(metadata.displayType);},userStyle:function userStyle(style){style=style||$module.attr('style')||'';return style.replace(/display.*?;/,'');},transitionExists:function transitionExists(animation){return $.fn.transition.exists[animation];},animationStartEvent:function animationStartEvent(){var element=document.createElement('div'),animations={'animation':'animationstart','OAnimation':'oAnimationStart','MozAnimation':'mozAnimationStart','WebkitAnimation':'webkitAnimationStart'},animation;for(animation in animations){if(element.style[animation]!==undefined){return animations[animation];}}return false;},animationEndEvent:function animationEndEvent(){var element=document.createElement('div'),animations={'animation':'animationend','OAnimation':'oAnimationEnd','MozAnimation':'mozAnimationEnd','WebkitAnimation':'webkitAnimationEnd'},animation;for(animation in animations){if(element.style[animation]!==undefined){return animations[animation];}}return false;}},can:{transition:function transition(forced){var animation=settings.animation,transitionExists=module.get.transitionExists(animation),displayType=module.get.displayType(false),elementClass,tagName,$clone,currentAnimation,inAnimation,directionExists;if(transitionExists===undefined||forced){module.verbose('Determining whether animation exists');elementClass=$module.attr('class');tagName=$module.prop('tagName');$clone=$('<'+tagName+' />').addClass(elementClass).insertAfter($module);currentAnimation=$clone.addClass(animation).removeClass(className.inward).removeClass(className.outward).addClass(className.animating).addClass(className.transition).css('animationName');inAnimation=$clone.addClass(className.inward).css('animationName');if(!displayType){displayType=$clone.attr('class',elementClass).removeAttr('style').removeClass(className.hidden).removeClass(className.visible).show().css('display');module.verbose('Determining final display state',displayType);module.save.displayType(displayType);}$clone.remove();if(currentAnimation!=inAnimation){module.debug('Direction exists for animation',animation);directionExists=true;}else if(currentAnimation=='none'||!currentAnimation){module.debug('No animation defined in css',animation);return;}else{module.debug('Static animation found',animation,displayType);directionExists=false;}module.save.transitionExists(animation,directionExists);}return transitionExists!==undefined?transitionExists:directionExists;},animate:function animate(){// can transition does not return a value if animation does not exist
return module.can.transition()!==undefined;}},is:{animating:function animating(){return $module.hasClass(className.animating);},inward:function inward(){return $module.hasClass(className.inward);},outward:function outward(){return $module.hasClass(className.outward);},looping:function looping(){return $module.hasClass(className.looping);},occurring:function occurring(animation){animation=animation||settings.animation;animation='.'+animation.replace(' ','.');return $module.filter(animation).length>0;},visible:function visible(){return $module.is(':visible');},hidden:function hidden(){return $module.css('visibility')==='hidden';},supported:function supported(){return animationEnd!==false;}},hide:function hide(){module.verbose('Hiding element');if(module.is.animating()){module.reset();}element.blur();// IE will trigger focus change if element is not blurred before hiding
module.remove.display();module.remove.visible();module.set.hidden();module.force.hidden();settings.onHide.call(element);settings.onComplete.call(element);// module.repaint();
},show:function show(display){module.verbose('Showing element',display);module.remove.hidden();module.set.visible();module.force.visible();settings.onShow.call(element);settings.onComplete.call(element);// module.repaint();
},toggle:function toggle(){if(module.is.visible()){module.hide();}else{module.show();}},stop:function stop(){module.debug('Stopping current animation');$module.triggerHandler(animationEnd);},stopAll:function stopAll(){module.debug('Stopping all animation');module.remove.queueCallback();$module.triggerHandler(animationEnd);},clear:{queue:function queue(){module.debug('Clearing animation queue');module.remove.queueCallback();}},enable:function enable(){module.verbose('Starting animation');$module.removeClass(className.disabled);},disable:function disable(){module.debug('Stopping animation');$module.addClass(className.disabled);},setting:function setting(name,value){module.debug('Changing setting',name,value);if($.isPlainObject(name)){$.extend(true,settings,name);}else if(value!==undefined){if($.isPlainObject(settings[name])){$.extend(true,settings[name],value);}else{settings[name]=value;}}else{return settings[name];}},internal:function internal(name,value){if($.isPlainObject(name)){$.extend(true,module,name);}else if(value!==undefined){module[name]=value;}else{return module[name];}},debug:function debug(){if(!settings.silent&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.debug=Function.prototype.bind.call(console.info,console,settings.name+':');module.debug.apply(console,arguments);}}},verbose:function verbose(){if(!settings.silent&&settings.verbose&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.verbose=Function.prototype.bind.call(console.info,console,settings.name+':');module.verbose.apply(console,arguments);}}},error:function error(){if(!settings.silent){module.error=Function.prototype.bind.call(console.error,console,settings.name+':');module.error.apply(console,arguments);}},performance:{log:function log(message){var currentTime,executionTime,previousTime;if(settings.performance){currentTime=new Date().getTime();previousTime=time||currentTime;executionTime=currentTime-previousTime;time=currentTime;performance.push({'Name':message[0],'Arguments':[].slice.call(message,1)||'','Element':element,'Execution Time':executionTime});}clearTimeout(module.performance.timer);module.performance.timer=setTimeout(module.performance.display,500);},display:function display(){var title=settings.name+':',totalTime=0;time=false;clearTimeout(module.performance.timer);$.each(performance,function(index,data){totalTime+=data['Execution Time'];});title+=' '+totalTime+'ms';if(moduleSelector){title+=' \''+moduleSelector+'\'';}if($allModules.length>1){title+=' '+'('+$allModules.length+')';}if((console.group!==undefined||console.table!==undefined)&&performance.length>0){console.groupCollapsed(title);if(console.table){console.table(performance);}else{$.each(performance,function(index,data){console.log(data['Name']+': '+data['Execution Time']+'ms');});}console.groupEnd();}performance=[];}},// modified for transition to return invoke success
invoke:function invoke(query,passedArguments,context){var object=instance,maxDepth,found,response;passedArguments=passedArguments||queryArguments;context=element||context;if(typeof query=='string'&&object!==undefined){query=query.split(/[\. ]/);maxDepth=query.length-1;$.each(query,function(depth,value){var camelCaseValue=depth!=maxDepth?value+query[depth+1].charAt(0).toUpperCase()+query[depth+1].slice(1):query;if($.isPlainObject(object[camelCaseValue])&&depth!=maxDepth){object=object[camelCaseValue];}else if(object[camelCaseValue]!==undefined){found=object[camelCaseValue];return false;}else if($.isPlainObject(object[value])&&depth!=maxDepth){object=object[value];}else if(object[value]!==undefined){found=object[value];return false;}else{return false;}});}if($.isFunction(found)){response=found.apply(context,passedArguments);}else if(found!==undefined){response=found;}if($.isArray(returnedValue)){returnedValue.push(response);}else if(returnedValue!==undefined){returnedValue=[returnedValue,response];}else if(response!==undefined){returnedValue=response;}return found!==undefined?found:false;}};module.initialize();});return returnedValue!==undefined?returnedValue:this;};// Records if CSS transition is available
$.fn.transition.exists={};$.fn.transition.settings={// module info
name:'Transition',// hide all output from this component regardless of other settings
silent:false,// debug content outputted to console
debug:false,// verbose debug output
verbose:false,// performance data output
performance:true,// event namespace
namespace:'transition',// delay between animations in group
interval:0,// whether group animations should be reversed
reverse:'auto',// animation callback event
onStart:function onStart(){},onComplete:function onComplete(){},onShow:function onShow(){},onHide:function onHide(){},// whether timeout should be used to ensure callback fires in cases animationend does not
useFailSafe:true,// delay in ms for fail safe
failSafeDelay:100,// whether EXACT animation can occur twice in a row
allowRepeats:false,// Override final display type on visible
displayType:false,// animation duration
animation:'fade',duration:false,// new animations will occur after previous ones
queue:true,metadata:{displayType:'display'},className:{animating:'animating',disabled:'disabled',hidden:'hidden',inward:'in',loading:'loading',looping:'looping',outward:'out',transition:'transition',visible:'visible'},// possible errors
error:{noAnimation:'Element is no longer attached to DOM. Unable to animate.  Use silent setting to surpress this warning in production.',repeated:'That animation is already occurring, cancelling repeated animation',method:'The method you called is not defined',support:'This browser does not support CSS animations'}};})(jQuery,window,document);/*!
 * # Semantic UI 2.2.11 - API
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */;(function($,window,document,undefined){"use strict";var window=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();$.api=$.fn.api=function(parameters){var// use window context if none specified
$allModules=$.isFunction(this)?$(window):$(this),moduleSelector=$allModules.selector||'',time=new Date().getTime(),performance=[],query=arguments[0],methodInvoked=typeof query=='string',queryArguments=[].slice.call(arguments,1),returnedValue;$allModules.each(function(){var _settings4=$.isPlainObject(parameters)?$.extend(true,{},$.fn.api.settings,parameters):$.extend({},$.fn.api.settings),// internal aliases
namespace=_settings4.namespace,metadata=_settings4.metadata,selector=_settings4.selector,error=_settings4.error,className=_settings4.className,// define namespaces for modules
eventNamespace='.'+namespace,moduleNamespace='module-'+namespace,// element that creates request
$module=$(this),$form=$module.closest(selector.form),// context used for state
$context=_settings4.stateContext?$(_settings4.stateContext):$module,// request details
ajaxSettings,requestSettings,url,data,requestStartTime,// standard module
element=this,context=$context[0],instance=$module.data(moduleNamespace),module;module={initialize:function initialize(){if(!methodInvoked){module.bind.events();}module.instantiate();},instantiate:function instantiate(){module.verbose('Storing instance of module',module);instance=module;$module.data(moduleNamespace,instance);},destroy:function destroy(){module.verbose('Destroying previous module for',element);$module.removeData(moduleNamespace).off(eventNamespace);},bind:{events:function events(){var triggerEvent=module.get.event();if(triggerEvent){module.verbose('Attaching API events to element',triggerEvent);$module.on(triggerEvent+eventNamespace,module.event.trigger);}else if(_settings4.on=='now'){module.debug('Querying API endpoint immediately');module.query();}}},decode:{json:function json(response){if(response!==undefined&&typeof response=='string'){try{response=JSON.parse(response);}catch(e){// isnt json string
}}return response;}},read:{cachedResponse:function cachedResponse(url){var response;if(window.Storage===undefined){module.error(error.noStorage);return;}response=sessionStorage.getItem(url);module.debug('Using cached response',url,response);response=module.decode.json(response);return response;}},write:{cachedResponse:function cachedResponse(url,response){if(response&&response===''){module.debug('Response empty, not caching',response);return;}if(window.Storage===undefined){module.error(error.noStorage);return;}if($.isPlainObject(response)){response=JSON.stringify(response);}sessionStorage.setItem(url,response);module.verbose('Storing cached response for url',url,response);}},query:function query(){if(module.is.disabled()){module.debug('Element is disabled API request aborted');return;}if(module.is.loading()){if(_settings4.interruptRequests){module.debug('Interrupting previous request');module.abort();}else{module.debug('Cancelling request, previous request is still pending');return;}}// pass element metadata to url (value, text)
if(_settings4.defaultData){$.extend(true,_settings4.urlData,module.get.defaultData());}// Add form content
if(_settings4.serializeForm){_settings4.data=module.add.formData(_settings4.data);}// call beforesend and get any settings changes
requestSettings=module.get.settings();// check if before send cancelled request
if(requestSettings===false){module.cancelled=true;module.error(error.beforeSend);return;}else{module.cancelled=false;}// get url
url=module.get.templatedURL();if(!url&&!module.is.mocked()){module.error(error.missingURL);return;}// replace variables
url=module.add.urlData(url);// missing url parameters
if(!url&&!module.is.mocked()){return;}requestSettings.url=_settings4.base+url;// look for jQuery ajax parameters in settings
ajaxSettings=$.extend(true,{},_settings4,{type:_settings4.method||_settings4.type,data:data,url:_settings4.base+url,beforeSend:_settings4.beforeXHR,success:function success(){},failure:function failure(){},complete:function complete(){}});module.debug('Querying URL',ajaxSettings.url);module.verbose('Using AJAX settings',ajaxSettings);if(_settings4.cache==='local'&&module.read.cachedResponse(url)){module.debug('Response returned from local cache');module.request=module.create.request();module.request.resolveWith(context,[module.read.cachedResponse(url)]);return;}if(!_settings4.throttle){module.debug('Sending request',data,ajaxSettings.method);module.send.request();}else{if(!_settings4.throttleFirstRequest&&!module.timer){module.debug('Sending request',data,ajaxSettings.method);module.send.request();module.timer=setTimeout(function(){},_settings4.throttle);}else{module.debug('Throttling request',_settings4.throttle);clearTimeout(module.timer);module.timer=setTimeout(function(){if(module.timer){delete module.timer;}module.debug('Sending throttled request',data,ajaxSettings.method);module.send.request();},_settings4.throttle);}}},should:{removeError:function removeError(){return _settings4.hideError===true||_settings4.hideError==='auto'&&!module.is.form();}},is:{disabled:function disabled(){return $module.filter(selector.disabled).length>0;},expectingJSON:function expectingJSON(){return _settings4.dataType==='json'||_settings4.dataType==='jsonp';},form:function form(){return $module.is('form')||$context.is('form');},mocked:function mocked(){return _settings4.mockResponse||_settings4.mockResponseAsync||_settings4.response||_settings4.responseAsync;},input:function input(){return $module.is('input');},loading:function loading(){return module.request?module.request.state()=='pending':false;},abortedRequest:function abortedRequest(xhr){if(xhr&&xhr.readyState!==undefined&&xhr.readyState===0){module.verbose('XHR request determined to be aborted');return true;}else{module.verbose('XHR request was not aborted');return false;}},validResponse:function validResponse(response){if(!module.is.expectingJSON()||!$.isFunction(_settings4.successTest)){module.verbose('Response is not JSON, skipping validation',_settings4.successTest,response);return true;}module.debug('Checking JSON returned success',_settings4.successTest,response);if(_settings4.successTest(response)){module.debug('Response passed success test',response);return true;}else{module.debug('Response failed success test',response);return false;}}},was:{cancelled:function cancelled(){return module.cancelled||false;},succesful:function succesful(){return module.request&&module.request.state()=='resolved';},failure:function failure(){return module.request&&module.request.state()=='rejected';},complete:function complete(){return module.request&&(module.request.state()=='resolved'||module.request.state()=='rejected');}},add:{urlData:function urlData(url,_urlData){var requiredVariables,optionalVariables;if(url){requiredVariables=url.match(_settings4.regExp.required);optionalVariables=url.match(_settings4.regExp.optional);_urlData=_urlData||_settings4.urlData;if(requiredVariables){module.debug('Looking for required URL variables',requiredVariables);$.each(requiredVariables,function(index,templatedString){var// allow legacy {$var} style
variable=templatedString.indexOf('$')!==-1?templatedString.substr(2,templatedString.length-3):templatedString.substr(1,templatedString.length-2),value=$.isPlainObject(_urlData)&&_urlData[variable]!==undefined?_urlData[variable]:$module.data(variable)!==undefined?$module.data(variable):$context.data(variable)!==undefined?$context.data(variable):_urlData[variable];// remove value
if(value===undefined){module.error(error.requiredParameter,variable,url);url=false;return false;}else{module.verbose('Found required variable',variable,value);value=_settings4.encodeParameters?module.get.urlEncodedValue(value):value;url=url.replace(templatedString,value);}});}if(optionalVariables){module.debug('Looking for optional URL variables',requiredVariables);$.each(optionalVariables,function(index,templatedString){var// allow legacy {/$var} style
variable=templatedString.indexOf('$')!==-1?templatedString.substr(3,templatedString.length-4):templatedString.substr(2,templatedString.length-3),value=$.isPlainObject(_urlData)&&_urlData[variable]!==undefined?_urlData[variable]:$module.data(variable)!==undefined?$module.data(variable):$context.data(variable)!==undefined?$context.data(variable):_urlData[variable];// optional replacement
if(value!==undefined){module.verbose('Optional variable Found',variable,value);url=url.replace(templatedString,value);}else{module.verbose('Optional variable not found',variable);// remove preceding slash if set
if(url.indexOf('/'+templatedString)!==-1){url=url.replace('/'+templatedString,'');}else{url=url.replace(templatedString,'');}}});}}return url;},formData:function formData(data){var canSerialize=$.fn.serializeObject!==undefined,formData=canSerialize?$form.serializeObject():$form.serialize(),hasOtherData;data=data||_settings4.data;hasOtherData=$.isPlainObject(data);if(hasOtherData){if(canSerialize){module.debug('Extending existing data with form data',data,formData);data=$.extend(true,{},data,formData);}else{module.error(error.missingSerialize);module.debug('Cant extend data. Replacing data with form data',data,formData);data=formData;}}else{module.debug('Adding form data',formData);data=formData;}return data;}},send:{request:function request(){module.set.loading();module.request=module.create.request();if(module.is.mocked()){module.mockedXHR=module.create.mockedXHR();}else{module.xhr=module.create.xhr();}_settings4.onRequest.call(context,module.request,module.xhr);}},event:{trigger:function trigger(event){module.query();if(event.type=='submit'||event.type=='click'){event.preventDefault();}},xhr:{always:function always(){// nothing special
},done:function done(response,textStatus,xhr){var context=this,elapsedTime=new Date().getTime()-requestStartTime,timeLeft=_settings4.loadingDuration-elapsedTime,translatedResponse=$.isFunction(_settings4.onResponse)?module.is.expectingJSON()?_settings4.onResponse.call(context,$.extend(true,{},response)):_settings4.onResponse.call(context,response):false;timeLeft=timeLeft>0?timeLeft:0;if(translatedResponse){module.debug('Modified API response in onResponse callback',_settings4.onResponse,translatedResponse,response);response=translatedResponse;}if(timeLeft>0){module.debug('Response completed early delaying state change by',timeLeft);}setTimeout(function(){if(module.is.validResponse(response)){module.request.resolveWith(context,[response,xhr]);}else{module.request.rejectWith(context,[xhr,'invalid']);}},timeLeft);},fail:function fail(xhr,status,httpMessage){var context=this,elapsedTime=new Date().getTime()-requestStartTime,timeLeft=_settings4.loadingDuration-elapsedTime;timeLeft=timeLeft>0?timeLeft:0;if(timeLeft>0){module.debug('Response completed early delaying state change by',timeLeft);}setTimeout(function(){if(module.is.abortedRequest(xhr)){module.request.rejectWith(context,[xhr,'aborted',httpMessage]);}else{module.request.rejectWith(context,[xhr,'error',status,httpMessage]);}},timeLeft);}},request:{done:function done(response,xhr){module.debug('Successful API Response',response);if(_settings4.cache==='local'&&url){module.write.cachedResponse(url,response);module.debug('Saving server response locally',module.cache);}_settings4.onSuccess.call(context,response,$module,xhr);},complete:function complete(firstParameter,secondParameter){var xhr,response;// have to guess callback parameters based on request success
if(module.was.succesful()){response=firstParameter;xhr=secondParameter;}else{xhr=firstParameter;response=module.get.responseFromXHR(xhr);}module.remove.loading();_settings4.onComplete.call(context,response,$module,xhr);},fail:function fail(xhr,status,httpMessage){var// pull response from xhr if available
response=module.get.responseFromXHR(xhr),errorMessage=module.get.errorFromRequest(response,status,httpMessage);if(status=='aborted'){module.debug('XHR Aborted (Most likely caused by page navigation or CORS Policy)',status,httpMessage);_settings4.onAbort.call(context,status,$module,xhr);return true;}else if(status=='invalid'){module.debug('JSON did not pass success test. A server-side error has most likely occurred',response);}else if(status=='error'){if(xhr!==undefined){module.debug('XHR produced a server error',status,httpMessage);// make sure we have an error to display to console
if(xhr.status!=200&&httpMessage!==undefined&&httpMessage!==''){module.error(error.statusMessage+httpMessage,ajaxSettings.url);}_settings4.onError.call(context,errorMessage,$module,xhr);}}if(_settings4.errorDuration&&status!=='aborted'){module.debug('Adding error state');module.set.error();if(module.should.removeError()){setTimeout(module.remove.error,_settings4.errorDuration);}}module.debug('API Request failed',errorMessage,xhr);_settings4.onFailure.call(context,response,$module,xhr);}}},create:{request:function request(){// api request promise
return $.Deferred().always(module.event.request.complete).done(module.event.request.done).fail(module.event.request.fail);},mockedXHR:function mockedXHR(){var// xhr does not simulate these properties of xhr but must return them
textStatus=false,status=false,httpMessage=false,responder=_settings4.mockResponse||_settings4.response,asyncResponder=_settings4.mockResponseAsync||_settings4.responseAsync,asyncCallback,response,mockedXHR;mockedXHR=$.Deferred().always(module.event.xhr.complete).done(module.event.xhr.done).fail(module.event.xhr.fail);if(responder){if($.isFunction(responder)){module.debug('Using specified synchronous callback',responder);response=responder.call(context,requestSettings);}else{module.debug('Using settings specified response',responder);response=responder;}// simulating response
mockedXHR.resolveWith(context,[response,textStatus,{responseText:response}]);}else if($.isFunction(asyncResponder)){asyncCallback=function asyncCallback(response){module.debug('Async callback returned response',response);if(response){mockedXHR.resolveWith(context,[response,textStatus,{responseText:response}]);}else{mockedXHR.rejectWith(context,[{responseText:response},status,httpMessage]);}};module.debug('Using specified async response callback',asyncResponder);asyncResponder.call(context,requestSettings,asyncCallback);}return mockedXHR;},xhr:function xhr(){var xhr;// ajax request promise
xhr=$.ajax(ajaxSettings).always(module.event.xhr.always).done(module.event.xhr.done).fail(module.event.xhr.fail);module.verbose('Created server request',xhr,ajaxSettings);return xhr;}},set:{error:function error(){module.verbose('Adding error state to element',$context);$context.addClass(className.error);},loading:function loading(){module.verbose('Adding loading state to element',$context);$context.addClass(className.loading);requestStartTime=new Date().getTime();}},remove:{error:function error(){module.verbose('Removing error state from element',$context);$context.removeClass(className.error);},loading:function loading(){module.verbose('Removing loading state from element',$context);$context.removeClass(className.loading);}},get:{responseFromXHR:function responseFromXHR(xhr){return $.isPlainObject(xhr)?module.is.expectingJSON()?module.decode.json(xhr.responseText):xhr.responseText:false;},errorFromRequest:function errorFromRequest(response,status,httpMessage){return $.isPlainObject(response)&&response.error!==undefined?response.error// use json error message
:_settings4.error[status]!==undefined?// use server error message
_settings4.error[status]:httpMessage;},request:function request(){return module.request||false;},xhr:function xhr(){return module.xhr||false;},settings:function settings(){var runSettings;runSettings=_settings4.beforeSend.call(context,_settings4);if(runSettings){if(runSettings.success!==undefined){module.debug('Legacy success callback detected',runSettings);module.error(error.legacyParameters,runSettings.success);runSettings.onSuccess=runSettings.success;}if(runSettings.failure!==undefined){module.debug('Legacy failure callback detected',runSettings);module.error(error.legacyParameters,runSettings.failure);runSettings.onFailure=runSettings.failure;}if(runSettings.complete!==undefined){module.debug('Legacy complete callback detected',runSettings);module.error(error.legacyParameters,runSettings.complete);runSettings.onComplete=runSettings.complete;}}if(runSettings===undefined){module.error(error.noReturnedValue);}if(runSettings===false){return runSettings;}return runSettings!==undefined?$.extend(true,{},runSettings):$.extend(true,{},_settings4);},urlEncodedValue:function urlEncodedValue(value){var decodedValue=window.decodeURIComponent(value),encodedValue=window.encodeURIComponent(value),alreadyEncoded=decodedValue!==value;if(alreadyEncoded){module.debug('URL value is already encoded, avoiding double encoding',value);return value;}module.verbose('Encoding value using encodeURIComponent',value,encodedValue);return encodedValue;},defaultData:function defaultData(){var data={};if(!$.isWindow(element)){if(module.is.input()){data.value=$module.val();}else if(module.is.form()){}else{data.text=$module.text();}}return data;},event:function event(){if($.isWindow(element)||_settings4.on=='now'){module.debug('API called without element, no events attached');return false;}else if(_settings4.on=='auto'){if($module.is('input')){return element.oninput!==undefined?'input':element.onpropertychange!==undefined?'propertychange':'keyup';}else if($module.is('form')){return'submit';}else{return'click';}}else{return _settings4.on;}},templatedURL:function templatedURL(action){action=action||$module.data(metadata.action)||_settings4.action||false;url=$module.data(metadata.url)||_settings4.url||false;if(url){module.debug('Using specified url',url);return url;}if(action){module.debug('Looking up url for action',action,_settings4.api);if(_settings4.api[action]===undefined&&!module.is.mocked()){module.error(error.missingAction,_settings4.action,_settings4.api);return;}url=_settings4.api[action];}else if(module.is.form()){url=$module.attr('action')||$context.attr('action')||false;module.debug('No url or action specified, defaulting to form action',url);}return url;}},abort:function abort(){var xhr=module.get.xhr();if(xhr&&xhr.state()!=='resolved'){module.debug('Cancelling API request');xhr.abort();}},// reset state
reset:function reset(){module.remove.error();module.remove.loading();},setting:function setting(name,value){module.debug('Changing setting',name,value);if($.isPlainObject(name)){$.extend(true,_settings4,name);}else if(value!==undefined){if($.isPlainObject(_settings4[name])){$.extend(true,_settings4[name],value);}else{_settings4[name]=value;}}else{return _settings4[name];}},internal:function internal(name,value){if($.isPlainObject(name)){$.extend(true,module,name);}else if(value!==undefined){module[name]=value;}else{return module[name];}},debug:function debug(){if(!_settings4.silent&&_settings4.debug){if(_settings4.performance){module.performance.log(arguments);}else{module.debug=Function.prototype.bind.call(console.info,console,_settings4.name+':');module.debug.apply(console,arguments);}}},verbose:function verbose(){if(!_settings4.silent&&_settings4.verbose&&_settings4.debug){if(_settings4.performance){module.performance.log(arguments);}else{module.verbose=Function.prototype.bind.call(console.info,console,_settings4.name+':');module.verbose.apply(console,arguments);}}},error:function error(){if(!_settings4.silent){module.error=Function.prototype.bind.call(console.error,console,_settings4.name+':');module.error.apply(console,arguments);}},performance:{log:function log(message){var currentTime,executionTime,previousTime;if(_settings4.performance){currentTime=new Date().getTime();previousTime=time||currentTime;executionTime=currentTime-previousTime;time=currentTime;performance.push({'Name':message[0],'Arguments':[].slice.call(message,1)||'',//'Element'        : element,
'Execution Time':executionTime});}clearTimeout(module.performance.timer);module.performance.timer=setTimeout(module.performance.display,500);},display:function display(){var title=_settings4.name+':',totalTime=0;time=false;clearTimeout(module.performance.timer);$.each(performance,function(index,data){totalTime+=data['Execution Time'];});title+=' '+totalTime+'ms';if(moduleSelector){title+=' \''+moduleSelector+'\'';}if((console.group!==undefined||console.table!==undefined)&&performance.length>0){console.groupCollapsed(title);if(console.table){console.table(performance);}else{$.each(performance,function(index,data){console.log(data['Name']+': '+data['Execution Time']+'ms');});}console.groupEnd();}performance=[];}},invoke:function invoke(query,passedArguments,context){var object=instance,maxDepth,found,response;passedArguments=passedArguments||queryArguments;context=element||context;if(typeof query=='string'&&object!==undefined){query=query.split(/[\. ]/);maxDepth=query.length-1;$.each(query,function(depth,value){var camelCaseValue=depth!=maxDepth?value+query[depth+1].charAt(0).toUpperCase()+query[depth+1].slice(1):query;if($.isPlainObject(object[camelCaseValue])&&depth!=maxDepth){object=object[camelCaseValue];}else if(object[camelCaseValue]!==undefined){found=object[camelCaseValue];return false;}else if($.isPlainObject(object[value])&&depth!=maxDepth){object=object[value];}else if(object[value]!==undefined){found=object[value];return false;}else{module.error(error.method,query);return false;}});}if($.isFunction(found)){response=found.apply(context,passedArguments);}else if(found!==undefined){response=found;}if($.isArray(returnedValue)){returnedValue.push(response);}else if(returnedValue!==undefined){returnedValue=[returnedValue,response];}else if(response!==undefined){returnedValue=response;}return found;}};if(methodInvoked){if(instance===undefined){module.initialize();}module.invoke(query);}else{if(instance!==undefined){instance.invoke('destroy');}module.initialize();}});return returnedValue!==undefined?returnedValue:this;};$.api.settings={name:'API',namespace:'api',debug:false,verbose:false,performance:true,// object containing all templates endpoints
api:{},// whether to cache responses
cache:true,// whether new requests should abort previous requests
interruptRequests:true,// event binding
on:'auto',// context for applying state classes
stateContext:false,// duration for loading state
loadingDuration:0,// whether to hide errors after a period of time
hideError:'auto',// duration for error state
errorDuration:2000,// whether parameters should be encoded with encodeURIComponent
encodeParameters:true,// API action to use
action:false,// templated URL to use
url:false,// base URL to apply to all endpoints
base:'',// data that will
urlData:{},// whether to add default data to url data
defaultData:true,// whether to serialize closest form
serializeForm:false,// how long to wait before request should occur
throttle:0,// whether to throttle first request or only repeated
throttleFirstRequest:true,// standard ajax settings
method:'get',data:{},dataType:'json',// mock response
mockResponse:false,mockResponseAsync:false,// aliases for mock
response:false,responseAsync:false,// callbacks before request
beforeSend:function beforeSend(settings){return settings;},beforeXHR:function beforeXHR(xhr){},onRequest:function onRequest(promise,xhr){},// after request
onResponse:false,// function(response) { },
// response was successful, if JSON passed validation
onSuccess:function onSuccess(response,$module){},// request finished without aborting
onComplete:function onComplete(response,$module){},// failed JSON success test
onFailure:function onFailure(response,$module){},// server error
onError:function onError(errorMessage,$module){},// request aborted
onAbort:function onAbort(errorMessage,$module){},successTest:false,// errors
error:{beforeSend:'The before send function has aborted the request',error:'There was an error with your request',exitConditions:'API Request Aborted. Exit conditions met',JSONParse:'JSON could not be parsed during error handling',legacyParameters:'You are using legacy API success callback names',method:'The method you called is not defined',missingAction:'API action used but no url was defined',missingSerialize:'jquery-serialize-object is required to add form data to an existing data object',missingURL:'No URL specified for api event',noReturnedValue:'The beforeSend callback must return a settings object, beforeSend ignored.',noStorage:'Caching responses locally requires session storage',parseError:'There was an error parsing your request',requiredParameter:'Missing a required URL parameter: ',statusMessage:'Server gave an error: ',timeout:'Your request timed out'},regExp:{required:/\{\$*[A-z0-9]+\}/g,optional:/\{\/\$*[A-z0-9]+\}/g},className:{loading:'loading',error:'error'},selector:{disabled:'.disabled',form:'form'},metadata:{action:'action',url:'url'}};})(jQuery,window,document);/*!
 * # Semantic UI 2.2.11 - State
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */;(function($,window,document,undefined){"use strict";window=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();$.fn.state=function(parameters){var $allModules=$(this),moduleSelector=$allModules.selector||'',hasTouch='ontouchstart'in document.documentElement,time=new Date().getTime(),performance=[],query=arguments[0],methodInvoked=typeof query=='string',queryArguments=[].slice.call(arguments,1),returnedValue;$allModules.each(function(){var settings=$.isPlainObject(parameters)?$.extend(true,{},$.fn.state.settings,parameters):$.extend({},$.fn.state.settings),error=settings.error,metadata=settings.metadata,className=settings.className,namespace=settings.namespace,states=settings.states,_text2=settings.text,eventNamespace='.'+namespace,moduleNamespace=namespace+'-module',$module=$(this),element=this,instance=$module.data(moduleNamespace),module;module={initialize:function initialize(){module.verbose('Initializing module');// allow module to guess desired state based on element
if(settings.automatic){module.add.defaults();}// bind events with delegated events
if(settings.context&&moduleSelector!==''){$(settings.context).on(moduleSelector,'mouseenter'+eventNamespace,module.change.text).on(moduleSelector,'mouseleave'+eventNamespace,module.reset.text).on(moduleSelector,'click'+eventNamespace,module.toggle.state);}else{$module.on('mouseenter'+eventNamespace,module.change.text).on('mouseleave'+eventNamespace,module.reset.text).on('click'+eventNamespace,module.toggle.state);}module.instantiate();},instantiate:function instantiate(){module.verbose('Storing instance of module',module);instance=module;$module.data(moduleNamespace,module);},destroy:function destroy(){module.verbose('Destroying previous module',instance);$module.off(eventNamespace).removeData(moduleNamespace);},refresh:function refresh(){module.verbose('Refreshing selector cache');$module=$(element);},add:{defaults:function defaults(){var userStates=parameters&&$.isPlainObject(parameters.states)?parameters.states:{};$.each(settings.defaults,function(type,typeStates){if(module.is[type]!==undefined&&module.is[type]()){module.verbose('Adding default states',type,element);$.extend(settings.states,typeStates,userStates);}});}},is:{active:function active(){return $module.hasClass(className.active);},loading:function loading(){return $module.hasClass(className.loading);},inactive:function inactive(){return!$module.hasClass(className.active);},state:function state(_state2){if(className[_state2]===undefined){return false;}return $module.hasClass(className[_state2]);},enabled:function enabled(){return!$module.is(settings.filter.active);},disabled:function disabled(){return $module.is(settings.filter.active);},textEnabled:function textEnabled(){return!$module.is(settings.filter.text);},// definitions for automatic type detection
button:function button(){return $module.is('.button:not(a, .submit)');},input:function input(){return $module.is('input');},progress:function progress(){return $module.is('.ui.progress');}},allow:function allow(state){module.debug('Now allowing state',state);states[state]=true;},disallow:function disallow(state){module.debug('No longer allowing',state);states[state]=false;},allows:function allows(state){return states[state]||false;},enable:function enable(){$module.removeClass(className.disabled);},disable:function disable(){$module.addClass(className.disabled);},setState:function setState(state){if(module.allows(state)){$module.addClass(className[state]);}},removeState:function removeState(state){if(module.allows(state)){$module.removeClass(className[state]);}},toggle:{state:function state(){var apiRequest,requestCancelled;if(module.allows('active')&&module.is.enabled()){module.refresh();if($.fn.api!==undefined){apiRequest=$module.api('get request');requestCancelled=$module.api('was cancelled');if(requestCancelled){module.debug('API Request cancelled by beforesend');settings.activateTest=function(){return false;};settings.deactivateTest=function(){return false;};}else if(apiRequest){module.listenTo(apiRequest);return;}}module.change.state();}}},listenTo:function listenTo(apiRequest){module.debug('API request detected, waiting for state signal',apiRequest);if(apiRequest){if(_text2.loading){module.update.text(_text2.loading);}$.when(apiRequest).then(function(){if(apiRequest.state()=='resolved'){module.debug('API request succeeded');settings.activateTest=function(){return true;};settings.deactivateTest=function(){return true;};}else{module.debug('API request failed');settings.activateTest=function(){return false;};settings.deactivateTest=function(){return false;};}module.change.state();});}},// checks whether active/inactive state can be given
change:{state:function state(){module.debug('Determining state change direction');// inactive to active change
if(module.is.inactive()){module.activate();}else{module.deactivate();}if(settings.sync){module.sync();}settings.onChange.call(element);},text:function text(){if(module.is.textEnabled()){if(module.is.disabled()){module.verbose('Changing text to disabled text',_text2.hover);module.update.text(_text2.disabled);}else if(module.is.active()){if(_text2.hover){module.verbose('Changing text to hover text',_text2.hover);module.update.text(_text2.hover);}else if(_text2.deactivate){module.verbose('Changing text to deactivating text',_text2.deactivate);module.update.text(_text2.deactivate);}}else{if(_text2.hover){module.verbose('Changing text to hover text',_text2.hover);module.update.text(_text2.hover);}else if(_text2.activate){module.verbose('Changing text to activating text',_text2.activate);module.update.text(_text2.activate);}}}}},activate:function activate(){if(settings.activateTest.call(element)){module.debug('Setting state to active');$module.addClass(className.active);module.update.text(_text2.active);settings.onActivate.call(element);}},deactivate:function deactivate(){if(settings.deactivateTest.call(element)){module.debug('Setting state to inactive');$module.removeClass(className.active);module.update.text(_text2.inactive);settings.onDeactivate.call(element);}},sync:function sync(){module.verbose('Syncing other buttons to current state');if(module.is.active()){$allModules.not($module).state('activate');}else{$allModules.not($module).state('deactivate');}},get:{text:function text(){return settings.selector.text?$module.find(settings.selector.text).text():$module.html();},textFor:function textFor(state){return _text2[state]||false;}},flash:{text:function text(_text3,duration,callback){var previousText=module.get.text();module.debug('Flashing text message',_text3,duration);_text3=_text3||settings.text.flash;duration=duration||settings.flashDuration;callback=callback||function(){};module.update.text(_text3);setTimeout(function(){module.update.text(previousText);callback.call(element);},duration);}},reset:{// on mouseout sets text to previous value
text:function text(){var activeText=_text2.active||$module.data(metadata.storedText),inactiveText=_text2.inactive||$module.data(metadata.storedText);if(module.is.textEnabled()){if(module.is.active()&&activeText){module.verbose('Resetting active text',activeText);module.update.text(activeText);}else if(inactiveText){module.verbose('Resetting inactive text',activeText);module.update.text(inactiveText);}}}},update:{text:function text(_text4){var currentText=module.get.text();if(_text4&&_text4!==currentText){module.debug('Updating text',_text4);if(settings.selector.text){$module.data(metadata.storedText,_text4).find(settings.selector.text).text(_text4);}else{$module.data(metadata.storedText,_text4).html(_text4);}}else{module.debug('Text is already set, ignoring update',_text4);}}},setting:function setting(name,value){module.debug('Changing setting',name,value);if($.isPlainObject(name)){$.extend(true,settings,name);}else if(value!==undefined){if($.isPlainObject(settings[name])){$.extend(true,settings[name],value);}else{settings[name]=value;}}else{return settings[name];}},internal:function internal(name,value){if($.isPlainObject(name)){$.extend(true,module,name);}else if(value!==undefined){module[name]=value;}else{return module[name];}},debug:function debug(){if(!settings.silent&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.debug=Function.prototype.bind.call(console.info,console,settings.name+':');module.debug.apply(console,arguments);}}},verbose:function verbose(){if(!settings.silent&&settings.verbose&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.verbose=Function.prototype.bind.call(console.info,console,settings.name+':');module.verbose.apply(console,arguments);}}},error:function error(){if(!settings.silent){module.error=Function.prototype.bind.call(console.error,console,settings.name+':');module.error.apply(console,arguments);}},performance:{log:function log(message){var currentTime,executionTime,previousTime;if(settings.performance){currentTime=new Date().getTime();previousTime=time||currentTime;executionTime=currentTime-previousTime;time=currentTime;performance.push({'Name':message[0],'Arguments':[].slice.call(message,1)||'','Element':element,'Execution Time':executionTime});}clearTimeout(module.performance.timer);module.performance.timer=setTimeout(module.performance.display,500);},display:function display(){var title=settings.name+':',totalTime=0;time=false;clearTimeout(module.performance.timer);$.each(performance,function(index,data){totalTime+=data['Execution Time'];});title+=' '+totalTime+'ms';if(moduleSelector){title+=' \''+moduleSelector+'\'';}if((console.group!==undefined||console.table!==undefined)&&performance.length>0){console.groupCollapsed(title);if(console.table){console.table(performance);}else{$.each(performance,function(index,data){console.log(data['Name']+': '+data['Execution Time']+'ms');});}console.groupEnd();}performance=[];}},invoke:function invoke(query,passedArguments,context){var object=instance,maxDepth,found,response;passedArguments=passedArguments||queryArguments;context=element||context;if(typeof query=='string'&&object!==undefined){query=query.split(/[\. ]/);maxDepth=query.length-1;$.each(query,function(depth,value){var camelCaseValue=depth!=maxDepth?value+query[depth+1].charAt(0).toUpperCase()+query[depth+1].slice(1):query;if($.isPlainObject(object[camelCaseValue])&&depth!=maxDepth){object=object[camelCaseValue];}else if(object[camelCaseValue]!==undefined){found=object[camelCaseValue];return false;}else if($.isPlainObject(object[value])&&depth!=maxDepth){object=object[value];}else if(object[value]!==undefined){found=object[value];return false;}else{module.error(error.method,query);return false;}});}if($.isFunction(found)){response=found.apply(context,passedArguments);}else if(found!==undefined){response=found;}if($.isArray(returnedValue)){returnedValue.push(response);}else if(returnedValue!==undefined){returnedValue=[returnedValue,response];}else if(response!==undefined){returnedValue=response;}return found;}};if(methodInvoked){if(instance===undefined){module.initialize();}module.invoke(query);}else{if(instance!==undefined){instance.invoke('destroy');}module.initialize();}});return returnedValue!==undefined?returnedValue:this;};$.fn.state.settings={// module info
name:'State',// debug output
debug:false,// verbose debug output
verbose:false,// namespace for events
namespace:'state',// debug data includes performance
performance:true,// callback occurs on state change
onActivate:function onActivate(){},onDeactivate:function onDeactivate(){},onChange:function onChange(){},// state test functions
activateTest:function activateTest(){return true;},deactivateTest:function deactivateTest(){return true;},// whether to automatically map default states
automatic:true,// activate / deactivate changes all elements instantiated at same time
sync:false,// default flash text duration, used for temporarily changing text of an element
flashDuration:1000,// selector filter
filter:{text:'.loading, .disabled',active:'.disabled'},context:false,// error
error:{beforeSend:'The before send function has cancelled state change',method:'The method you called is not defined.'},// metadata
metadata:{promise:'promise',storedText:'stored-text'},// change class on state
className:{active:'active',disabled:'disabled',error:'error',loading:'loading',success:'success',warning:'warning'},selector:{// selector for text node
text:false},defaults:{input:{disabled:true,loading:true,active:true},button:{disabled:true,loading:true,active:true},progress:{active:true,success:true,warning:true,error:true}},states:{active:true,disabled:true,error:true,loading:true,success:true,warning:true},text:{disabled:false,flash:false,hover:false,active:false,inactive:false,activate:false,deactivate:false}};})(jQuery,window,document);/*!
 * # Semantic UI 2.2.11 - Visibility
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */;(function($,window,document,undefined){"use strict";window=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();$.fn.visibility=function(parameters){var $allModules=$(this),moduleSelector=$allModules.selector||'',time=new Date().getTime(),performance=[],query=arguments[0],methodInvoked=typeof query=='string',queryArguments=[].slice.call(arguments,1),returnedValue,moduleCount=$allModules.length,loadedCount=0;$allModules.each(function(){var settings=$.isPlainObject(parameters)?$.extend(true,{},$.fn.visibility.settings,parameters):$.extend({},$.fn.visibility.settings),className=settings.className,namespace=settings.namespace,error=settings.error,metadata=settings.metadata,eventNamespace='.'+namespace,moduleNamespace='module-'+namespace,$window=$(window),$module=$(this),$context=$(settings.context),$placeholder,selector=$module.selector||'',instance=$module.data(moduleNamespace),requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||function(callback){setTimeout(callback,0);},element=this,disabled=false,contextObserver,observer,module;module={initialize:function initialize(){module.debug('Initializing',settings);module.setup.cache();if(module.should.trackChanges()){if(settings.type=='image'){module.setup.image();}if(settings.type=='fixed'){module.setup.fixed();}if(settings.observeChanges){module.observeChanges();}module.bind.events();}module.save.position();if(!module.is.visible()){module.error(error.visible,$module);}if(settings.initialCheck){module.checkVisibility();}module.instantiate();},instantiate:function instantiate(){module.debug('Storing instance',module);$module.data(moduleNamespace,module);instance=module;},destroy:function destroy(){module.verbose('Destroying previous module');if(observer){observer.disconnect();}if(contextObserver){contextObserver.disconnect();}$window.off('load'+eventNamespace,module.event.load).off('resize'+eventNamespace,module.event.resize);$context.off('scroll'+eventNamespace,module.event.scroll).off('scrollchange'+eventNamespace,module.event.scrollchange);if(settings.type=='fixed'){module.resetFixed();module.remove.placeholder();}$module.off(eventNamespace).removeData(moduleNamespace);},observeChanges:function observeChanges(){if('MutationObserver'in window){contextObserver=new MutationObserver(module.event.contextChanged);observer=new MutationObserver(module.event.changed);contextObserver.observe(document,{childList:true,subtree:true});observer.observe(element,{childList:true,subtree:true});module.debug('Setting up mutation observer',observer);}},bind:{events:function events(){module.verbose('Binding visibility events to scroll and resize');if(settings.refreshOnLoad){$window.on('load'+eventNamespace,module.event.load);}$window.on('resize'+eventNamespace,module.event.resize);// pub/sub pattern
$context.off('scroll'+eventNamespace).on('scroll'+eventNamespace,module.event.scroll).on('scrollchange'+eventNamespace,module.event.scrollchange);}},event:{changed:function changed(mutations){module.verbose('DOM tree modified, updating visibility calculations');module.timer=setTimeout(function(){module.verbose('DOM tree modified, updating sticky menu');module.refresh();},100);},contextChanged:function contextChanged(mutations){[].forEach.call(mutations,function(mutation){if(mutation.removedNodes){[].forEach.call(mutation.removedNodes,function(node){if(node==element||$(node).find(element).length>0){module.debug('Element removed from DOM, tearing down events');module.destroy();}});}});},resize:function resize(){module.debug('Window resized');if(settings.refreshOnResize){requestAnimationFrame(module.refresh);}},load:function load(){module.debug('Page finished loading');requestAnimationFrame(module.refresh);},// publishes scrollchange event on one scroll
scroll:function scroll(){if(settings.throttle){clearTimeout(module.timer);module.timer=setTimeout(function(){$context.triggerHandler('scrollchange'+eventNamespace,[$context.scrollTop()]);},settings.throttle);}else{requestAnimationFrame(function(){$context.triggerHandler('scrollchange'+eventNamespace,[$context.scrollTop()]);});}},// subscribes to scrollchange
scrollchange:function scrollchange(event,scrollPosition){module.checkVisibility(scrollPosition);}},precache:function precache(images,callback){if(!(images instanceof Array)){images=[images];}var imagesLength=images.length,loadedCounter=0,cache=[],cacheImage=document.createElement('img'),handleLoad=function handleLoad(){loadedCounter++;if(loadedCounter>=images.length){if($.isFunction(callback)){callback();}}};while(imagesLength--){cacheImage=document.createElement('img');cacheImage.onload=handleLoad;cacheImage.onerror=handleLoad;cacheImage.src=images[imagesLength];cache.push(cacheImage);}},enableCallbacks:function enableCallbacks(){module.debug('Allowing callbacks to occur');disabled=false;},disableCallbacks:function disableCallbacks(){module.debug('Disabling all callbacks temporarily');disabled=true;},should:{trackChanges:function trackChanges(){if(methodInvoked){module.debug('One time query, no need to bind events');return false;}module.debug('Callbacks being attached');return true;}},setup:{cache:function cache(){module.cache={occurred:{},screen:{},element:{}};},image:function image(){var src=$module.data(metadata.src);if(src){module.verbose('Lazy loading image',src);settings.once=true;settings.observeChanges=false;// show when top visible
settings.onOnScreen=function(){module.debug('Image on screen',element);module.precache(src,function(){module.set.image(src,function(){loadedCount++;if(loadedCount==moduleCount){settings.onAllLoaded.call(this);}settings.onLoad.call(this);});});};}},fixed:function fixed(){module.debug('Setting up fixed');settings.once=false;settings.observeChanges=false;settings.initialCheck=true;settings.refreshOnLoad=true;if(!parameters.transition){settings.transition=false;}module.create.placeholder();module.debug('Added placeholder',$placeholder);settings.onTopPassed=function(){module.debug('Element passed, adding fixed position',$module);module.show.placeholder();module.set.fixed();if(settings.transition){if($.fn.transition!==undefined){$module.transition(settings.transition,settings.duration);}}};settings.onTopPassedReverse=function(){module.debug('Element returned to position, removing fixed',$module);module.hide.placeholder();module.remove.fixed();};}},create:{placeholder:function placeholder(){module.verbose('Creating fixed position placeholder');$placeholder=$module.clone(false).css('display','none').addClass(className.placeholder).insertAfter($module);}},show:{placeholder:function placeholder(){module.verbose('Showing placeholder');$placeholder.css('display','block').css('visibility','hidden');}},hide:{placeholder:function placeholder(){module.verbose('Hiding placeholder');$placeholder.css('display','none').css('visibility','');}},set:{fixed:function fixed(){module.verbose('Setting element to fixed position');$module.addClass(className.fixed).css({position:'fixed',top:settings.offset+'px',left:'auto',zIndex:settings.zIndex});settings.onFixed.call(element);},image:function image(src,callback){$module.attr('src',src);if(settings.transition){if($.fn.transition!==undefined){if($module.hasClass(className.visible)){module.debug('Transition already occurred on this image, skipping animation');return;}$module.transition(settings.transition,settings.duration,callback);}else{$module.fadeIn(settings.duration,callback);}}else{$module.show();}}},is:{onScreen:function onScreen(){var calculations=module.get.elementCalculations();return calculations.onScreen;},offScreen:function offScreen(){var calculations=module.get.elementCalculations();return calculations.offScreen;},visible:function visible(){if(module.cache&&module.cache.element){return!(module.cache.element.width===0&&module.cache.element.offset.top===0);}return false;},verticallyScrollableContext:function verticallyScrollableContext(){var overflowY=$context.get(0)!==window?$context.css('overflow-y'):false;return overflowY=='auto'||overflowY=='scroll';},horizontallyScrollableContext:function horizontallyScrollableContext(){var overflowX=$context.get(0)!==window?$context.css('overflow-x'):false;return overflowX=='auto'||overflowX=='scroll';}},refresh:function refresh(){module.debug('Refreshing constants (width/height)');if(settings.type=='fixed'){module.resetFixed();}module.reset();module.save.position();if(settings.checkOnRefresh){module.checkVisibility();}settings.onRefresh.call(element);},resetFixed:function resetFixed(){module.remove.fixed();module.remove.occurred();},reset:function reset(){module.verbose('Resetting all cached values');if($.isPlainObject(module.cache)){module.cache.screen={};module.cache.element={};}},checkVisibility:function checkVisibility(scroll){module.verbose('Checking visibility of element',module.cache.element);if(!disabled&&module.is.visible()){// save scroll position
module.save.scroll(scroll);// update calculations derived from scroll
module.save.calculations();// percentage
module.passed();// reverse (must be first)
module.passingReverse();module.topVisibleReverse();module.bottomVisibleReverse();module.topPassedReverse();module.bottomPassedReverse();// one time
module.onScreen();module.offScreen();module.passing();module.topVisible();module.bottomVisible();module.topPassed();module.bottomPassed();// on update callback
if(settings.onUpdate){settings.onUpdate.call(element,module.get.elementCalculations());}}},passed:function passed(amount,newCallback){var calculations=module.get.elementCalculations(),amountInPixels;// assign callback
if(amount&&newCallback){settings.onPassed[amount]=newCallback;}else if(amount!==undefined){return module.get.pixelsPassed(amount)>calculations.pixelsPassed;}else if(calculations.passing){$.each(settings.onPassed,function(amount,callback){if(calculations.bottomVisible||calculations.pixelsPassed>module.get.pixelsPassed(amount)){module.execute(callback,amount);}else if(!settings.once){module.remove.occurred(callback);}});}},onScreen:function onScreen(newCallback){var calculations=module.get.elementCalculations(),callback=newCallback||settings.onOnScreen,callbackName='onScreen';if(newCallback){module.debug('Adding callback for onScreen',newCallback);settings.onOnScreen=newCallback;}if(calculations.onScreen){module.execute(callback,callbackName);}else if(!settings.once){module.remove.occurred(callbackName);}if(newCallback!==undefined){return calculations.onOnScreen;}},offScreen:function offScreen(newCallback){var calculations=module.get.elementCalculations(),callback=newCallback||settings.onOffScreen,callbackName='offScreen';if(newCallback){module.debug('Adding callback for offScreen',newCallback);settings.onOffScreen=newCallback;}if(calculations.offScreen){module.execute(callback,callbackName);}else if(!settings.once){module.remove.occurred(callbackName);}if(newCallback!==undefined){return calculations.onOffScreen;}},passing:function passing(newCallback){var calculations=module.get.elementCalculations(),callback=newCallback||settings.onPassing,callbackName='passing';if(newCallback){module.debug('Adding callback for passing',newCallback);settings.onPassing=newCallback;}if(calculations.passing){module.execute(callback,callbackName);}else if(!settings.once){module.remove.occurred(callbackName);}if(newCallback!==undefined){return calculations.passing;}},topVisible:function topVisible(newCallback){var calculations=module.get.elementCalculations(),callback=newCallback||settings.onTopVisible,callbackName='topVisible';if(newCallback){module.debug('Adding callback for top visible',newCallback);settings.onTopVisible=newCallback;}if(calculations.topVisible){module.execute(callback,callbackName);}else if(!settings.once){module.remove.occurred(callbackName);}if(newCallback===undefined){return calculations.topVisible;}},bottomVisible:function bottomVisible(newCallback){var calculations=module.get.elementCalculations(),callback=newCallback||settings.onBottomVisible,callbackName='bottomVisible';if(newCallback){module.debug('Adding callback for bottom visible',newCallback);settings.onBottomVisible=newCallback;}if(calculations.bottomVisible){module.execute(callback,callbackName);}else if(!settings.once){module.remove.occurred(callbackName);}if(newCallback===undefined){return calculations.bottomVisible;}},topPassed:function topPassed(newCallback){var calculations=module.get.elementCalculations(),callback=newCallback||settings.onTopPassed,callbackName='topPassed';if(newCallback){module.debug('Adding callback for top passed',newCallback);settings.onTopPassed=newCallback;}if(calculations.topPassed){module.execute(callback,callbackName);}else if(!settings.once){module.remove.occurred(callbackName);}if(newCallback===undefined){return calculations.topPassed;}},bottomPassed:function bottomPassed(newCallback){var calculations=module.get.elementCalculations(),callback=newCallback||settings.onBottomPassed,callbackName='bottomPassed';if(newCallback){module.debug('Adding callback for bottom passed',newCallback);settings.onBottomPassed=newCallback;}if(calculations.bottomPassed){module.execute(callback,callbackName);}else if(!settings.once){module.remove.occurred(callbackName);}if(newCallback===undefined){return calculations.bottomPassed;}},passingReverse:function passingReverse(newCallback){var calculations=module.get.elementCalculations(),callback=newCallback||settings.onPassingReverse,callbackName='passingReverse';if(newCallback){module.debug('Adding callback for passing reverse',newCallback);settings.onPassingReverse=newCallback;}if(!calculations.passing){if(module.get.occurred('passing')){module.execute(callback,callbackName);}}else if(!settings.once){module.remove.occurred(callbackName);}if(newCallback!==undefined){return!calculations.passing;}},topVisibleReverse:function topVisibleReverse(newCallback){var calculations=module.get.elementCalculations(),callback=newCallback||settings.onTopVisibleReverse,callbackName='topVisibleReverse';if(newCallback){module.debug('Adding callback for top visible reverse',newCallback);settings.onTopVisibleReverse=newCallback;}if(!calculations.topVisible){if(module.get.occurred('topVisible')){module.execute(callback,callbackName);}}else if(!settings.once){module.remove.occurred(callbackName);}if(newCallback===undefined){return!calculations.topVisible;}},bottomVisibleReverse:function bottomVisibleReverse(newCallback){var calculations=module.get.elementCalculations(),callback=newCallback||settings.onBottomVisibleReverse,callbackName='bottomVisibleReverse';if(newCallback){module.debug('Adding callback for bottom visible reverse',newCallback);settings.onBottomVisibleReverse=newCallback;}if(!calculations.bottomVisible){if(module.get.occurred('bottomVisible')){module.execute(callback,callbackName);}}else if(!settings.once){module.remove.occurred(callbackName);}if(newCallback===undefined){return!calculations.bottomVisible;}},topPassedReverse:function topPassedReverse(newCallback){var calculations=module.get.elementCalculations(),callback=newCallback||settings.onTopPassedReverse,callbackName='topPassedReverse';if(newCallback){module.debug('Adding callback for top passed reverse',newCallback);settings.onTopPassedReverse=newCallback;}if(!calculations.topPassed){if(module.get.occurred('topPassed')){module.execute(callback,callbackName);}}else if(!settings.once){module.remove.occurred(callbackName);}if(newCallback===undefined){return!calculations.onTopPassed;}},bottomPassedReverse:function bottomPassedReverse(newCallback){var calculations=module.get.elementCalculations(),callback=newCallback||settings.onBottomPassedReverse,callbackName='bottomPassedReverse';if(newCallback){module.debug('Adding callback for bottom passed reverse',newCallback);settings.onBottomPassedReverse=newCallback;}if(!calculations.bottomPassed){if(module.get.occurred('bottomPassed')){module.execute(callback,callbackName);}}else if(!settings.once){module.remove.occurred(callbackName);}if(newCallback===undefined){return!calculations.bottomPassed;}},execute:function execute(callback,callbackName){var calculations=module.get.elementCalculations(),screen=module.get.screenCalculations();callback=callback||false;if(callback){if(settings.continuous){module.debug('Callback being called continuously',callbackName,calculations);callback.call(element,calculations,screen);}else if(!module.get.occurred(callbackName)){module.debug('Conditions met',callbackName,calculations);callback.call(element,calculations,screen);}}module.save.occurred(callbackName);},remove:{fixed:function fixed(){module.debug('Removing fixed position');$module.removeClass(className.fixed).css({position:'',top:'',left:'',zIndex:''});settings.onUnfixed.call(element);},placeholder:function placeholder(){module.debug('Removing placeholder content');if($placeholder){$placeholder.remove();}},occurred:function occurred(callback){if(callback){var occurred=module.cache.occurred;if(occurred[callback]!==undefined&&occurred[callback]===true){module.debug('Callback can now be called again',callback);module.cache.occurred[callback]=false;}}else{module.cache.occurred={};}}},save:{calculations:function calculations(){module.verbose('Saving all calculations necessary to determine positioning');module.save.direction();module.save.screenCalculations();module.save.elementCalculations();},occurred:function occurred(callback){if(callback){if(module.cache.occurred[callback]===undefined||module.cache.occurred[callback]!==true){module.verbose('Saving callback occurred',callback);module.cache.occurred[callback]=true;}}},scroll:function scroll(scrollPosition){scrollPosition=scrollPosition+settings.offset||$context.scrollTop()+settings.offset;module.cache.scroll=scrollPosition;},direction:function direction(){var scroll=module.get.scroll(),lastScroll=module.get.lastScroll(),direction;if(scroll>lastScroll&&lastScroll){direction='down';}else if(scroll<lastScroll&&lastScroll){direction='up';}else{direction='static';}module.cache.direction=direction;return module.cache.direction;},elementPosition:function elementPosition(){var element=module.cache.element,screen=module.get.screenSize();module.verbose('Saving element position');// (quicker than $.extend)
element.fits=element.height<screen.height;element.offset=$module.offset();element.width=$module.outerWidth();element.height=$module.outerHeight();// compensate for scroll in context
if(module.is.verticallyScrollableContext()){element.offset.top+=$context.scrollTop()-$context.offset().top;}if(module.is.horizontallyScrollableContext()){element.offset.left+=$context.scrollLeft-$context.offset().left;}// store
module.cache.element=element;return element;},elementCalculations:function elementCalculations(){var screen=module.get.screenCalculations(),element=module.get.elementPosition();// offset
if(settings.includeMargin){element.margin={};element.margin.top=parseInt($module.css('margin-top'),10);element.margin.bottom=parseInt($module.css('margin-bottom'),10);element.top=element.offset.top-element.margin.top;element.bottom=element.offset.top+element.height+element.margin.bottom;}else{element.top=element.offset.top;element.bottom=element.offset.top+element.height;}// visibility
element.topPassed=screen.top>=element.top;element.bottomPassed=screen.top>=element.bottom;element.topVisible=screen.bottom>=element.top&&!element.bottomPassed;element.bottomVisible=screen.bottom>=element.bottom&&!element.topPassed;element.pixelsPassed=0;element.percentagePassed=0;// meta calculations
element.onScreen=element.topVisible&&!element.bottomPassed;element.passing=element.topPassed&&!element.bottomPassed;element.offScreen=!element.onScreen;// passing calculations
if(element.passing){element.pixelsPassed=screen.top-element.top;element.percentagePassed=(screen.top-element.top)/element.height;}module.cache.element=element;module.verbose('Updated element calculations',element);return element;},screenCalculations:function screenCalculations(){var scroll=module.get.scroll();module.save.direction();module.cache.screen.top=scroll;module.cache.screen.bottom=scroll+module.cache.screen.height;return module.cache.screen;},screenSize:function screenSize(){module.verbose('Saving window position');module.cache.screen={height:$context.height()};},position:function position(){module.save.screenSize();module.save.elementPosition();}},get:{pixelsPassed:function pixelsPassed(amount){var element=module.get.elementCalculations();if(amount.search('%')>-1){return element.height*(parseInt(amount,10)/100);}return parseInt(amount,10);},occurred:function occurred(callback){return module.cache.occurred!==undefined?module.cache.occurred[callback]||false:false;},direction:function direction(){if(module.cache.direction===undefined){module.save.direction();}return module.cache.direction;},elementPosition:function elementPosition(){if(module.cache.element===undefined){module.save.elementPosition();}return module.cache.element;},elementCalculations:function elementCalculations(){if(module.cache.element===undefined){module.save.elementCalculations();}return module.cache.element;},screenCalculations:function screenCalculations(){if(module.cache.screen===undefined){module.save.screenCalculations();}return module.cache.screen;},screenSize:function screenSize(){if(module.cache.screen===undefined){module.save.screenSize();}return module.cache.screen;},scroll:function scroll(){if(module.cache.scroll===undefined){module.save.scroll();}return module.cache.scroll;},lastScroll:function lastScroll(){if(module.cache.screen===undefined){module.debug('First scroll event, no last scroll could be found');return false;}return module.cache.screen.top;}},setting:function setting(name,value){if($.isPlainObject(name)){$.extend(true,settings,name);}else if(value!==undefined){settings[name]=value;}else{return settings[name];}},internal:function internal(name,value){if($.isPlainObject(name)){$.extend(true,module,name);}else if(value!==undefined){module[name]=value;}else{return module[name];}},debug:function debug(){if(!settings.silent&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.debug=Function.prototype.bind.call(console.info,console,settings.name+':');module.debug.apply(console,arguments);}}},verbose:function verbose(){if(!settings.silent&&settings.verbose&&settings.debug){if(settings.performance){module.performance.log(arguments);}else{module.verbose=Function.prototype.bind.call(console.info,console,settings.name+':');module.verbose.apply(console,arguments);}}},error:function error(){if(!settings.silent){module.error=Function.prototype.bind.call(console.error,console,settings.name+':');module.error.apply(console,arguments);}},performance:{log:function log(message){var currentTime,executionTime,previousTime;if(settings.performance){currentTime=new Date().getTime();previousTime=time||currentTime;executionTime=currentTime-previousTime;time=currentTime;performance.push({'Name':message[0],'Arguments':[].slice.call(message,1)||'','Element':element,'Execution Time':executionTime});}clearTimeout(module.performance.timer);module.performance.timer=setTimeout(module.performance.display,500);},display:function display(){var title=settings.name+':',totalTime=0;time=false;clearTimeout(module.performance.timer);$.each(performance,function(index,data){totalTime+=data['Execution Time'];});title+=' '+totalTime+'ms';if(moduleSelector){title+=' \''+moduleSelector+'\'';}if((console.group!==undefined||console.table!==undefined)&&performance.length>0){console.groupCollapsed(title);if(console.table){console.table(performance);}else{$.each(performance,function(index,data){console.log(data['Name']+': '+data['Execution Time']+'ms');});}console.groupEnd();}performance=[];}},invoke:function invoke(query,passedArguments,context){var object=instance,maxDepth,found,response;passedArguments=passedArguments||queryArguments;context=element||context;if(typeof query=='string'&&object!==undefined){query=query.split(/[\. ]/);maxDepth=query.length-1;$.each(query,function(depth,value){var camelCaseValue=depth!=maxDepth?value+query[depth+1].charAt(0).toUpperCase()+query[depth+1].slice(1):query;if($.isPlainObject(object[camelCaseValue])&&depth!=maxDepth){object=object[camelCaseValue];}else if(object[camelCaseValue]!==undefined){found=object[camelCaseValue];return false;}else if($.isPlainObject(object[value])&&depth!=maxDepth){object=object[value];}else if(object[value]!==undefined){found=object[value];return false;}else{module.error(error.method,query);return false;}});}if($.isFunction(found)){response=found.apply(context,passedArguments);}else if(found!==undefined){response=found;}if($.isArray(returnedValue)){returnedValue.push(response);}else if(returnedValue!==undefined){returnedValue=[returnedValue,response];}else if(response!==undefined){returnedValue=response;}return found;}};if(methodInvoked){if(instance===undefined){module.initialize();}instance.save.scroll();instance.save.calculations();module.invoke(query);}else{if(instance!==undefined){instance.invoke('destroy');}module.initialize();}});return returnedValue!==undefined?returnedValue:this;};$.fn.visibility.settings={name:'Visibility',namespace:'visibility',debug:false,verbose:false,performance:true,// whether to use mutation observers to follow changes
observeChanges:true,// check position immediately on init
initialCheck:true,// whether to refresh calculations after all page images load
refreshOnLoad:true,// whether to refresh calculations after page resize event
refreshOnResize:true,// should call callbacks on refresh event (resize, etc)
checkOnRefresh:true,// callback should only occur one time
once:true,// callback should fire continuously whe evaluates to true
continuous:false,// offset to use with scroll top
offset:0,// whether to include margin in elements position
includeMargin:false,// scroll context for visibility checks
context:window,// visibility check delay in ms (defaults to animationFrame)
throttle:false,// special visibility type (image, fixed)
type:false,// z-index to use with visibility 'fixed'
zIndex:'10',// image only animation settings
transition:'fade in',duration:1000,// array of callbacks for percentage
onPassed:{},// standard callbacks
onOnScreen:false,onOffScreen:false,onPassing:false,onTopVisible:false,onBottomVisible:false,onTopPassed:false,onBottomPassed:false,// reverse callbacks
onPassingReverse:false,onTopVisibleReverse:false,onBottomVisibleReverse:false,onTopPassedReverse:false,onBottomPassedReverse:false,// special callbacks for image
onLoad:function onLoad(){},onAllLoaded:function onAllLoaded(){},// special callbacks for fixed position
onFixed:function onFixed(){},onUnfixed:function onUnfixed(){},// utility callbacks
onUpdate:false,// disabled by default for performance
onRefresh:function onRefresh(){},metadata:{src:'src'},className:{fixed:'fixed',placeholder:'placeholder',visible:'visible'},error:{method:'The method you called is not defined.',visible:'Element is hidden, you must call refresh after element becomes visible'}};})(jQuery,window,document);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 이름으로 조회
 */
(0, _jquery2.default)('#btn-name-send').on('click', function () {
    var name = _jquery2.default.trim((0, _jquery2.default)('#nameInput').val());
    var docs = void 0;
    var date = void 0;
    var idx = 1;

    (0, _jquery2.default)('#name').attr({
        disabled: false
    });

    (0, _jquery2.default)('#birth').attr({
        disabled: false
    });

    (0, _jquery2.default)('.ui.dropdown').removeClass("disabled");

    if (!name) {
        alert("이름을 입력해주세요.");
        return;
    }

    docs = {
        name: name
    };

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/receipt/patients',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {

        console.log(result);
        if (!result.length) {

            (0, _jquery2.default)('#nameMessage').html('[ ' + name + ' ]' + ' 님에 대한 정보가 없습니다.');

            (0, _jquery2.default)('#message').attr({
                class: 'ui negative message',
                hidden: false
            });

            setTimeout(function () {
                (0, _jquery2.default)('#message').closest('.message').transition('fade');
            }, 1000);

            (0, _jquery2.default)('#nameInput').val('');
            (0, _jquery2.default)('#name').val(name);
            (0, _jquery2.default)('#height').val('');
            (0, _jquery2.default)('#weight').val('');
            (0, _jquery2.default)('#drinking').val('');
            (0, _jquery2.default)('#smoking').val('');
            (0, _jquery2.default)('#birth').val('');
            (0, _jquery2.default)('#smokingPeriod').val('');
            (0, _jquery2.default)('#drinkingPeriod').val('');
            (0, _jquery2.default)('#bmi').val('');
            (0, _jquery2.default)('#diseaseDescription').val('');
            (0, _jquery2.default)('#allergyDescription').val('');
            (0, _jquery2.default)('input[name="pastMedical"][value="Y"]').prop("checked", true).trigger("change");
            (0, _jquery2.default)('input[name="pastMedication"][value="Y"]').prop("checked", true).trigger("change");
            (0, _jquery2.default)('input[name="pastMedicationDescription"]').val('');
            (0, _jquery2.default)('input[name="pastMedicalDescription"]').val('');

            date = new Date();
            (0, _jquery2.default)('#firstcome').val(date.getFullYear() + ' 년 ' + (date.getMonth() + 1) + ' 월 ' + date.getDate() + ' 일 ');

            for (idx; idx < 12; idx++) {
                var id = '#disease' + idx;
                var id2 = '#allergy' + idx;

                (0, _jquery2.default)(id).prop("checked", false);
                (0, _jquery2.default)(id2).prop("checked", false);
            }
            idx = 1;

            return;
        }

        if (result.length == 1) {

            (0, _jquery2.default)('#nameMessage').html('[ ' + result[0].name + ' ]' + ' 님이 조회됐습니다.');

            (0, _jquery2.default)('#message').attr({
                class: 'ui positive message',
                hidden: false
            });

            setTimeout(function () {
                (0, _jquery2.default)('#message').closest('.message').transition('fade');
            }, 1000);

            (0, _jquery2.default)('#nameInput').val('');

            (0, _jquery2.default)('#name').attr("disabled", true).val(result[0].name);

            (0, _jquery2.default)('#height').val(result[0].height);

            (0, _jquery2.default)('#weight').val(result[0].weight);

            (0, _jquery2.default)('#drinking').val(result[0].smokingAmount);

            (0, _jquery2.default)('#smoking').val(result[0].drinkingAmount);

            (0, _jquery2.default)('#smokingPeriod').val(result[0].smokingPeriod);

            (0, _jquery2.default)('#drinkingPeriod').val(result[0].drinkingPeriod);
            (0, _jquery2.default)('#bmi').val(result[0].bmi);

            date = new Date(result[0].firstVisit).toISOString().slice(0, 10);

            (0, _jquery2.default)('#firstcome').val(date);

            date = new Date(result[0].birth).toISOString().slice(0, 10);

            (0, _jquery2.default)('#birth').attr("disabled", true).val(date);

            (0, _jquery2.default)('#gender').dropdown('set selected', result[0].gender);

            (0, _jquery2.default)('.ui.dropdown').addClass("disabled");

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = result[0].histories[0].pastHistory[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var i = _step.value;

                    var _id = '#disease' + idx;
                    if (i == 1) {
                        (0, _jquery2.default)(_id).prop("checked", true);
                    }
                    idx++;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            idx = 1;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = result[0].histories[0].allergy[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _i = _step2.value;

                    var _id2 = '#allergy' + idx;
                    if (_i == 1) {
                        (0, _jquery2.default)(_id2).prop("checked", true);
                    }
                    idx++;
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            var value = result[0].histories[0].pastMedical;

            (0, _jquery2.default)('input[name="pastMedical"][value=' + value + ']').prop('checked', true).trigger("change");

            (0, _jquery2.default)('#pastMedicalTime').val(result[0].histories[0].pastMedicalTime);
            (0, _jquery2.default)('#pastMedicalArea').val(result[0].histories[0].pastMedicalArea);

            value = result[0].histories[0].pastMedication;

            (0, _jquery2.default)('input[name="pastMedication"][value=' + value + ']').prop('checked', true).trigger("change");

            (0, _jquery2.default)('#pastMedicationPeriod').val(result[0].histories[0].pastMedicationPeriod);
            (0, _jquery2.default)('#pastMedicationType').val(result[0].histories[0].pastMedicationType);

            (0, _jquery2.default)('#diseaseDescription').val(result[0].histories[0].pastHistoryComment);

            (0, _jquery2.default)('#allergyDescription').val(result[0].histories[0].allergyComment);
        } else {

            (0, _jquery2.default)('#nameInput').val('');

            if ((0, _jquery2.default)('#list').children().length) (0, _jquery2.default)('#list *').remove();

            for (var _i2 = 0; _i2 < result.length; _i2++) {
                date = new Date(result[_i2].birth);
                (0, _jquery2.default)('#nameInput').val('');
                (0, _jquery2.default)('#list').append('  <div id=' + result[_i2].id + '  class="item" align="middle">\n' + '                    <div id=' + result[_i2].id + ' class="content">\n' + '                        <div id=' + result[_i2].id + ' class="header">' + result[_i2].name + '</div>\n' + '                        ' + date.getFullYear() + ' 년 ' + (date.getMonth() + 1) + ' 월 ' + date.getDate() + ' 일 ' + '                    </div>\n' + '                </div>');
            }

            (0, _jquery2.default)('.ui.basic.modal').modal('show');
        }
    });
});

/**
 * 동명이인 id로 조회
 */
(0, _jquery2.default)(document).on('click', '.item', function (e) {
    var date = void 0;
    var idx = 1;
    var docs = {
        id: e.target.id
    };

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/receipt/patient',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {
        console.log('#####');
        console.log(result);
        (0, _jquery2.default)('#nameMessage').html('[ ' + result.name + ' ]' + ' 님이 조회됐습니다.');

        (0, _jquery2.default)('#message').attr({
            class: 'ui positive message',
            hidden: false
        });

        setTimeout(function () {
            (0, _jquery2.default)('#message').closest('.message').transition('fade');
        }, 1000);

        (0, _jquery2.default)('#nameInput').val('');

        (0, _jquery2.default)('#name').attr("disabled", true).val(result.name);

        (0, _jquery2.default)('#height').val(result.height);

        (0, _jquery2.default)('#weight').val(result.weight);

        (0, _jquery2.default)('#drinking').val(result.smokingAmount);

        (0, _jquery2.default)('#smoking').val(result.drinkingAmount);

        (0, _jquery2.default)('#smokingPeriod').val(result.smokingPeriod);

        (0, _jquery2.default)('#drinkingPeriod').val(result.drinkingPeriod);

        (0, _jquery2.default)('#bmi').val(result.bmi);

        date = new Date(result.firstVisit).toISOString().slice(0, 10);

        (0, _jquery2.default)('#firstcome').val(date);

        date = new Date(result.birth).toISOString().slice(0, 10);

        (0, _jquery2.default)('#birth').attr("disabled", true).val(date);

        (0, _jquery2.default)('#gender').dropdown('set selected', result.gender);

        (0, _jquery2.default)('.ui.dropdown').addClass("disabled");

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = result.histories[0].pastHistory[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var i = _step3.value;

                var id = '#disease' + idx;
                if (i == 1) {
                    (0, _jquery2.default)(id).prop("checked", true);
                }
                idx++;
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        idx = 1;
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = result.histories[0].allergy[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var _i3 = _step4.value;

                var _id3 = '#allergy' + idx;
                if (_i3 == 1) {
                    (0, _jquery2.default)(_id3).prop("checked", true);
                }
                idx++;
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }

        var value = result.histories[0].pastMedical;

        (0, _jquery2.default)('input[name="pastMedical"][value=' + value + ']').prop('checked', true).trigger("change");

        (0, _jquery2.default)('#pastMedicalTime').val(result.histories[0].pastMedicalTime);
        (0, _jquery2.default)('#pastMedicalArea').val(result.histories[0].pastMedicalArea);

        value = result.histories[0].pastMedication;

        (0, _jquery2.default)('input[name="pastMedication"][value=' + value + ']').prop('checked', true).trigger("change");

        (0, _jquery2.default)('#pastMedicationPeriod').val(result.histories[0].pastMedicationPeriod);
        (0, _jquery2.default)('#pastMedicationType').val(result.histories[0].pastMedicationType);

        (0, _jquery2.default)('#diseaseDescription').val(result.histories[0].pastHistoryComment);

        (0, _jquery2.default)('#allergyDescription').val(result.histories[0].allergyComment);

        (0, _jquery2.default)('.ui.basic.modal').modal('hide');
    });
});

(0, _jquery2.default)('.ui.dropdown').dropdown();

(0, _jquery2.default)('.ui.checkbox').checkbox();

(0, _jquery2.default)('#weight, #height').change(function () {
    var weight = (0, _jquery2.default)('#weight').val();
    var height = (0, _jquery2.default)('#height').val() / 100;
    var bmi = weight / (height * height);

    (0, _jquery2.default)('#bmi').val(bmi.toFixed(5));
});

var getDiseaseHistory = function getDiseaseHistory() {
    var check = '';

    (0, _jquery2.default)('.disease').each(function () {
        (0, _jquery2.default)(this).is(':checked') ? check += "1" : check += "0";
    });

    return check;
};

var getAllergyHistory = function getAllergyHistory() {
    var check = '';

    (0, _jquery2.default)('.allergy').each(function () {
        (0, _jquery2.default)(this).is(':checked') ? check += "1" : check += "0";
    });

    return check;
};

(0, _jquery2.default)('input[name="pastMedical"]').on('change', function () {
    var type = (0, _jquery2.default)('input[name="pastMedical"]:checked').val();

    if (type === 'N') {
        (0, _jquery2.default)('#pastMedicalTime').prop('disabled', true);
        (0, _jquery2.default)('#pastMedicalArea').prop('disabled', true);
    }

    if (type === 'Y') {
        (0, _jquery2.default)('#pastMedicalTime').prop('disabled', false);
        (0, _jquery2.default)('#pastMedicalArea').prop('disabled', false);
    }
});

(0, _jquery2.default)('input[name="pastMedication"]').on('change', function () {
    var type = (0, _jquery2.default)('input[name="pastMedication"]:checked').val();

    if (type === 'N') {
        (0, _jquery2.default)('#pastMedicationPeriod').prop('disabled', true);
        (0, _jquery2.default)('#pastMedicationType').prop('disabled', true);
    }

    if (type === 'Y') {
        (0, _jquery2.default)('#pastMedicationPeriod').prop('disabled', false);
        (0, _jquery2.default)('#pastMedicationType').prop('disabled', false);
    }
});

(0, _jquery2.default)('#sendToPart2').on('click', function () {
    var docs = void 0;
    var name = (0, _jquery2.default)('#name').val();
    var birth = (0, _jquery2.default)('#birth').val();
    var height = (0, _jquery2.default)('#height').val();
    var weight = (0, _jquery2.default)('#weight').val();
    var BMI = (0, _jquery2.default)('#bmi').val();
    var gender = (0, _jquery2.default)('#gender').val();
    var smokingAmount = (0, _jquery2.default)('#smoking').val();
    var smokingPeriod = (0, _jquery2.default)('#smokingPeriod').val();
    var drinkingAmount = (0, _jquery2.default)('#drinking').val();
    var drinkingPeriod = (0, _jquery2.default)('#drinkingPeriod').val();
    var pastHistory = getDiseaseHistory();
    var pastHistoryComment = (0, _jquery2.default)('#diseaseDescription').val();
    var allergy = getAllergyHistory();
    var allergyComment = (0, _jquery2.default)('#allergyDescription').val();
    var pastMedical = (0, _jquery2.default)('input[name=pastMedical]:checked').val();
    var pastMedicalTime = (0, _jquery2.default)('#pastMedicalTime').val();
    var pastMedicalArea = (0, _jquery2.default)('#pastMedicalArea').val();
    var pastMedicationPeriod = (0, _jquery2.default)('#pastMedicationPeriod').val();
    var pastMedicationType = (0, _jquery2.default)('#pastMedicationType').val();
    var pastMedication = (0, _jquery2.default)('input[name=pastMedication]:checked').val();

    docs = {
        name: name,
        birth: birth,
        height: height,
        weight: weight,
        BMI: BMI,
        gender: gender,
        smokingAmount: smokingAmount,
        smokingPeriod: smokingPeriod,
        drinkingAmount: drinkingAmount,
        drinkingPeriod: drinkingPeriod,
        pastHistory: pastHistory,
        pastHistoryComment: pastHistoryComment,
        allergy: allergy,
        allergyComment: allergyComment,
        pastMedical: pastMedical,
        pastMedicalTime: pastMedicalTime,
        pastMedicalArea: pastMedicalArea,
        pastMedicationPeriod: pastMedicationPeriod,
        pastMedicationType: pastMedicationType,
        pastMedication: pastMedication
    };

    _jquery2.default.ajax({
        type: 'POST',
        url: 'http://localhost:3000/receipt/patient',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {
        window.scrollTo(0, 0);

        (0, _jquery2.default)('#patient_form').each(function () {
            this.reset();
        });

        console.log(result);
        //todo 정상적으로 등록되었는지 어럴트, 정상적 등록시 적힌데이터 지우기
    });
});

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _jquery2.default)('#waitingList').on('click', function () {

    if ((0, _jquery2.default)('#tableBody').children().length) (0, _jquery2.default)('#tableBody *').remove();

    var docs = {
        status: '1'
    };

    console.log("waitList Callback");
    console.log("waitList Callback");
    console.log("waitList Callback");

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/waitingList',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {

        console.log(result);
        for (var i = 0; i < result.length; i++) {
            (0, _jquery2.default)('#tableBody').append('<tr id=' + result[i].chart_id + ' class="table-content">\n                       <td id=' + result[i].chart_id + '>' + result[i].chart_id + '</td>\n                       <td id=' + result[i].chart_id + '>' + result[i].name + '</td>\n                       <td id=' + result[i].chart_id + '>' + result[i].birth + '</td>\n                </tr>');
        }
    });

    (0, _jquery2.default)('.ui.longer.modal').modal('show');
});

(0, _jquery2.default)(document).on('click', '.table-content', function (e) {

    console.log(e.target);
    var docs = {
        chartNumber: e.target.id
    };

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/chart',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {

        (0, _jquery2.default)('#preChartId').val(result.chartNumber);
        (0, _jquery2.default)('#preName').val(result.patient.name);

        (0, _jquery2.default)('#getPastCC').attr('disabled', false);
        (0, _jquery2.default)('#pastDiagnosisRecord').attr('disabled', false);
        (0, _jquery2.default)('#vitalSign').attr('disabled', false);
    });

    (0, _jquery2.default)('.ui.longer.modal').modal('hide');
});

(0, _jquery2.default)(document).on('click', '.negative.send.ui.button', function () {
    var heartRate = (0, _jquery2.default)('#heartRate').val();
    var pulseRate = (0, _jquery2.default)('#pulseRate').val();
    var bodyTemporature = (0, _jquery2.default)('#bodyTemporature').val();
    var systoleBloodPressure = (0, _jquery2.default)('#systoleBloodPressure').val();
    var diastoleBloodPressure = (0, _jquery2.default)('#diastoleBloodPressure').val();
    var bloodGlucose = (0, _jquery2.default)('#bloodGlucose').val();
    var mealTerm = (0, _jquery2.default)('#mealTerm').val();
    var chartNumber = (0, _jquery2.default)('#preChartId').val();
    var ccData = (0, _jquery2.default)('#CCform').serializeArray();

    var docs = {
        heartRate: heartRate,
        pulseRate: pulseRate,
        bodyTemporature: bodyTemporature,
        systoleBloodPressure: systoleBloodPressure,
        diastoleBloodPressure: diastoleBloodPressure,
        bloodGlucose: bloodGlucose,
        mealTerm: mealTerm,
        chartNumber: chartNumber,
        ccArray: JSON.stringify(ccData)
    };

    _jquery2.default.ajax({
        type: 'POST',
        url: 'http://localhost:3000/chart/update',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {
        if (result.length == 1) {
            (0, _jquery2.default)('#chartForm, #CCform').each(function () {
                this.reset();
            });

            if ((0, _jquery2.default)('#CCsegment').children().length > 0) {
                (0, _jquery2.default)('#CCsegment *').remove();
            }

            (0, _jquery2.default)('#getPastCC').attr('disabled', true);
            return 0;
        }
    });
});

(0, _jquery2.default)('#CCbutton').on('click', function () {
    var ref = (0, _jquery2.default)('#CCsegment').children().length;

    (0, _jquery2.default)('#CCsegment').append(' <div class="inner-div">\n            <button type="button" class="ui red inverted button" style="margin-bottom: 1%">\uC0AD\uC81C</button>\n            <div class="sixteen wide column">\n                    <div class="ui fluid input focus">\n                        <input name="CC ' + ref + '" type="text" placeholder="C.C">\n                    </div>\n\n                    <div class="ui form" style="margin-top: 1%">\n                        <div class="field">\n                            <textarea name="HistoryOfCC ' + ref + '" rows="3" placeholder="History of C.C"></textarea>\n                        </div>\n                    </div>\n                </div>\n            </div>');
});

(0, _jquery2.default)('#getPastCC').on('click', function () {

    var chartId = (0, _jquery2.default)('#preChartId').val();
    var docs = {
        chartId: chartId
    };

    if ((0, _jquery2.default)('#tablePastBody').children().length) (0, _jquery2.default)('#tablePastBody *').remove();

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/chart/pastAll',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {
        console.log(result);
        for (var i = 0; i < result.length; i++) {
            (0, _jquery2.default)('#tablePastBody').append('<tr id=' + result[i].chartNumber + ' class="tablecontent">\n                        <td id=' + result[i].chartNumber + '>' + result[i].chartNumber + '</td>\n                        <td id=' + result[i].chartNumber + '>' + result[i].createdAt + '</td>\n                 </tr>');
        }
    });

    (0, _jquery2.default)('.ui.past.modal').modal('show');
});

(0, _jquery2.default)(document).on('click', '.tbody-content', function (e) {

    var chartNumber = e.target.id;

    var docs = {
        chartNumber: chartNumber
    };

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/chart/pastOne',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {
        for (var i = 0; i < result.complaints.length; i++) {
            (0, _jquery2.default)('#modalPastCC').append('<div class="inner-div">\n                    <button type="button" class="ui red inverted button" style="margin-bottom: 1%" disabled>\uC0AD\uC81C</button\n                    <div class="sixteen wide column">\n                        <div class="ui fluid input focus">\n                            <input name="CC ' + i + '" type="text" value=\'' + result.complaints[i].chiefComplaint + '\' disabled>\n                        </div>\n\n                        <div class="ui form" style="margin-top: 1%">\n                            <div class="field">\n                                <textarea name="HistoryOfCC ' + i + '" rows="3" disabled>' + result.complaints[i].chiefComplaintHistory + '</textarea>\n                            </div>\n                        </div>\n                    </div>\n                </div>');
        };
    });

    (0, _jquery2.default)('.ui.cc.modal').modal('show');
});

(0, _jquery2.default)('#copyButton').on('click', function () {

    (0, _jquery2.default)('#firstCC').remove();

    (0, _jquery2.default)("#modalPastCC :input").prop("disabled", false);

    var clone = (0, _jquery2.default)('#modalPastCC').children().clone();

    if ((0, _jquery2.default)('#CCsegment').children().length) {

        (0, _jquery2.default)('#CCsegment *').remove();
    }

    (0, _jquery2.default)('#CCsegment').append(clone);

    (0, _jquery2.default)('.ui.cc.modal').modal('hide');

    (0, _jquery2.default)('#modalPastCC *').remove();
});

(0, _jquery2.default)(document).on('click', '.ui.red.inverted', function (e) {

    e.target.parentNode.remove();
});

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _jquery2.default)('.diagnosisWaitings').on('click', function () {

    if ((0, _jquery2.default)('#tableBody').children().length) (0, _jquery2.default)('#tableBody *').remove();

    var docs = {
        status: '2'
    };

    _jquery2.default.ajax({
        type: 'GET',
        url: '/waitingList',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {

        // console.log(result);
        for (var i = 0; i < result.length; i++) {
            (0, _jquery2.default)('#tableBody').append('<tr id=' + result[i].chart_id + ' class="table-content">\n                    <td id=' + result[i].chart_id + '>' + result[i].chart_id + '</td>\n                    <td id=' + result[i].chart_id + '>' + result[i].name + '</td>\n                    <td id=' + result[i].chart_id + '>' + result[i].birth + '</td>\n                </tr>');
        }
    });

    (0, _jquery2.default)('.ui.longer.modal').modal('show');
    (0, _jquery2.default)(".completeTab").removeClass("active");
    (0, _jquery2.default)(".waitingTab").addClass("active");
});

(0, _jquery2.default)('.waitingTab').on('click', function () {

    if ((0, _jquery2.default)('#tableBody').children().length) (0, _jquery2.default)('#tableBody *').remove();

    var docs = {
        status: '2'
    };

    _jquery2.default.ajax({
        type: 'GET',
        url: '/waitingList',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {

        console.log(result);
        for (var i = 0; i < result.length; i++) {
            (0, _jquery2.default)('#tableBody').append('<tr id=' + result[i].chart_id + ' class="table-content">\n                       <td id=' + result[i].chart_id + '>' + result[i].chart_id + '</td>\n                       <td id=' + result[i].chart_id + '>' + result[i].name + '</td>\n                       <td id=' + result[i].chart_id + '>' + result[i].birth + '</td>\n                </tr>');
        }
    });

    (0, _jquery2.default)(".completeTab").removeClass("active");
    (0, _jquery2.default)(".waitingTab").addClass("active");
});

(0, _jquery2.default)('.completeTab').on('click', function () {

    if ((0, _jquery2.default)('#tableBody').children().length) (0, _jquery2.default)('#tableBody *').remove();

    var docs = {
        status: '1'
    };

    _jquery2.default.ajax({
        type: 'GET',
        url: '/waitingList',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {

        console.log(result);
        for (var i = 0; i < result.length; i++) {
            (0, _jquery2.default)('#tableBody').append('<tr id=' + result[i].chart_id + ' class="table-content">\n                       <td id=' + result[i].chart_id + '>' + result[i].chart_id + '</td>\n                       <td id=' + result[i].chart_id + '>' + result[i].name + '</td>\n                       <td id=' + result[i].chart_id + '>' + result[i].birth + '</td>\n                </tr>');
        }
    });

    (0, _jquery2.default)(".waitingTab").removeClass("active");
    (0, _jquery2.default)(".completeTab").addClass("active");
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _jquery2.default)(document).ready(function () {
    if ((0, _jquery2.default)('#PharmacyOCSTableBody').children().length) (0, _jquery2.default)('#PharmacyOCSTableBody *').remove();

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/waitingList',
        dataType: 'json',
        cache: false
    }).done(function (result) {

        var convertStatus = '';

        for (var i = 0; i < result.length; i++) {

            convertStatus = getStatus(result[i].status);
            (0, _jquery2.default)('#PharmacyOCSTableBody').append('<tr id=' + result[i].chart_id + ' class="table-content">\n                   <td>' + result[i].name + '</td>\n                   <td>' + convertStatus + '</td>\n            </tr>');
        }
    });
});

(0, _jquery2.default)('.getPharmacyOCS').on('click', function () {

    if ((0, _jquery2.default)('#PharmacyOCSTableBody').children().length) (0, _jquery2.default)('#PharmacyOCSTableBody *').remove();

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/waitingList',
        dataType: 'json',
        cache: false
    }).done(function (result) {

        var convertStatus = '';

        for (var i = 0; i < result.length; i++) {

            convertStatus = getStatus(result[i].status);
            (0, _jquery2.default)('#PharmacyOCSTableBody').append('<tr id=' + result[i].chart_id + ' class="table-content">\n                   <td>' + result[i].name + '</td>\n                   <td>' + convertStatus + '</td>\n            </tr>');
        }
    });
});

(0, _jquery2.default)('#pharmacopoeia').on('click', function () {
    (0, _jquery2.default)('.ui.longer.modal').modal('show');
});

function getStatus(status) {

    switch (status) {
        case 1:
            return '접수';break;
        case 2:
            return '예진';break;
        case 3:
            return '본진';break;
        case 4:
            return '대기';break;
        case 5:
            return '조제';break;
        case 6:
            return '완료';break;
    }
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
  path: "/__webpack_hmr",
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  name: '',
  autoConnect: true
};
if (false) {
  var querystring = require('querystring');
  var overrides = querystring.parse(__resourceQuery.slice(1));
  setOverrides(overrides);
}

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  if (options.autoConnect) {
    connect();
  }
}

/* istanbul ignore next */
function setOptionsAndConnect(overrides) {
  setOverrides(overrides);
  connect();
}

function setOverrides(overrides) {
  if (overrides.autoConnect) options.autoConnect = overrides.autoConnect == 'true';
  if (overrides.path) options.path = overrides.path;
  if (overrides.timeout) options.timeout = overrides.timeout;
  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
  if (overrides.reload) options.reload = overrides.reload !== 'false';
  if (overrides.noInfo && overrides.noInfo !== 'false') {
    options.log = false;
  }
  if (overrides.name) {
    options.name = overrides.name;
  }
  if (overrides.quiet && overrides.quiet !== 'false') {
    options.log = false;
    options.warn = false;
  }

  if (overrides.dynamicPublicPath) {
    options.path = __webpack_require__.p + options.path;
  }
}

function EventSourceWrapper() {
  var source;
  var lastActivity = new Date();
  var listeners = [];

  init();
  var timer = setInterval(function() {
    if ((new Date() - lastActivity) > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log("[HMR] connected");
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn);
    }
  };
}

function getEventSourceWrapper() {
  if (!window.__whmEventSourceWrapper) {
    window.__whmEventSourceWrapper = {};
  }
  if (!window.__whmEventSourceWrapper[options.path]) {
    // cache the wrapper for other entries loaded on
    // the same page with the same options.path
    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
  }
  return window.__whmEventSourceWrapper[options.path];
}

function connect() {
  getEventSourceWrapper().addMessageListener(handleMessage);

  function handleMessage(event) {
    if (event.data == "\uD83D\uDC93") {
      return;
    }
    try {
      processMessage(JSON.parse(event.data));
    } catch (ex) {
      if (options.warn) {
        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
      }
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
  if (!window[singletonKey]) {
    window[singletonKey] = createReporter();
  }
  reporter = window[singletonKey];
}

function createReporter() {
  var strip = __webpack_require__(16);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(18);
  }

  var styles = {
    errors: "color: #ff0000;",
    warnings: "color: #999933;"
  };
  var previousProblems = null;
  function log(type, obj) {
    var newProblems = obj[type].map(function(msg) { return strip(msg); }).join('\n');
    if (previousProblems == newProblems) {
      return;
    } else {
      previousProblems = newProblems;
    }

    var style = styles[type];
    var name = obj.name ? "'" + obj.name + "' " : "";
    var title = "[HMR] bundle " + name + "has " + obj[type].length + " " + type;
    // NOTE: console.warn or console.error will print the stack trace
    // which isn't helpful here, so using console.log to escape it.
    if (console.group && console.groupEnd) {
      console.group("%c" + title, style);
      console.log("%c" + newProblems, style);
      console.groupEnd();
    } else {
      console.log(
        "%c" + title + "\n\t%c" + newProblems.replace(/\n/g, "\n\t"),
        style + "font-weight: bold;",
        style + "font-weight: normal;"
      );
    }
  }

  return {
    cleanProblemsCache: function () {
      previousProblems = null;
    },
    problems: function(type, obj) {
      if (options.warn) {
        log(type, obj);
      }
      if (overlay && type !== 'warnings') overlay.showProblems(type, obj[type]);
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    }
  };
}

var processUpdate = __webpack_require__(23);

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
  switch(obj.action) {
    case "building":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilding"
        );
      }
      break;
    case "built":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // fall through
    case "sync":
      if (obj.name && options.name && obj.name !== options.name) {
        return;
      }
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
      } else {
        if (reporter) {
          if (obj.warnings.length > 0) {
            reporter.problems('warnings', obj);
          } else {
            reporter.cleanProblemsCache();
          }
          reporter.success();
        }
        processUpdate(obj.hash, obj.modules, options);
      }
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }

  if (subscribeAllHandler) {
    subscribeAllHandler(obj);
  }
}

if (module) {
  module.exports = {
    subscribeAll: function subscribeAll(handler) {
      subscribeAllHandler = handler;
    },
    subscribe: function subscribe(handler) {
      customHandler = handler;
    },
    useCustomOverlay: function useCustomOverlay(customOverlay) {
      if (reporter) reporter.useCustomOverlay(customOverlay);
    },
    setOptionsAndConnect: setOptionsAndConnect
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)(module)))

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(17)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
  background: 'rgba(0,0,0,0.85)',
  color: '#E8E8E8',
  lineHeight: '1.2',
  whiteSpace: 'pre',
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '13px',
  position: 'fixed',
  zIndex: 9999,
  padding: '10px',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
  dir: 'ltr',
  textAlign: 'left'
};
for (var key in styles) {
  clientOverlay.style[key] = styles[key];
}

var ansiHTML = __webpack_require__(19);
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};
ansiHTML.setColors(colors);

var Entities = __webpack_require__(20).AllHtmlEntities;
var entities = new Entities();

exports.showProblems =
function showProblems(type, lines) {
  clientOverlay.innerHTML = '';
  lines.forEach(function(msg) {
    msg = ansiHTML(entities.encode(msg));
    var div = document.createElement('div');
    div.style.marginBottom = '26px';
    div.innerHTML = problemType(type) + ' in ' + msg;
    clientOverlay.appendChild(div);
  });
  if (document.body) {
    document.body.appendChild(clientOverlay);
  }
};

exports.clear =
function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
};

var problemColors = {
  errors: colors.red,
  warnings: colors.yellow
};

function problemType (type) {
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
      type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(21),
  Html4Entities: __webpack_require__(22),
  Html5Entities: __webpack_require__(1),
  AllHtmlEntities: __webpack_require__(1)
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),
/* 22 */
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Based heavily on https://github.com/webpack/webpack/blob/
 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
 * Original copyright Tobias Koppers @sokra (MIT license)
 */

/* global window __webpack_hash__ */

if (false) {
  throw new Error("[HMR] Hot Module Replacement is disabled.");
}

var hmrDocsUrl = "https://webpack.js.org/concepts/hot-module-replacement/"; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = { 				
  ignoreUnaccepted: true,
  ignoreDeclined: true,
  ignoreErrored: true,
  onUnaccepted: function(data) {
    console.warn("Ignored an update to unaccepted module " + data.chain.join(" -> "));
  },
  onDeclined: function(data) {
    console.warn("Ignored an update to declined module " + data.chain.join(" -> "));
  },
  onErrored: function(data) {
    console.error(data.error);
    console.warn("Ignored an error while updating module " + data.moduleId + " (" + data.type + ")");
  } 
}

function upToDate(hash) {
  if (hash) lastHash = hash;
  return lastHash == __webpack_require__.h();
}

module.exports = function(hash, moduleMap, options) {
  var reload = options.reload;
  if (!upToDate(hash) && module.hot.status() == "idle") {
    if (options.log) console.log("[HMR] Checking for updates on the server...");
    check();
  }

  function check() {
    var cb = function(err, updatedModules) {
      if (err) return handleError(err);

      if(!updatedModules) {
        if (options.warn) {
          console.warn("[HMR] Cannot find update (Full reload needed)");
          console.warn("[HMR] (Probably because of restarting the server)");
        }
        performReload();
        return null;
      }

      var applyCallback = function(applyErr, renewedModules) {
        if (applyErr) return handleError(applyErr);

        if (!upToDate()) check();

        logUpdates(updatedModules, renewedModules);
      };

      var applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }

    };

    var result = module.hot.check(false, cb);
    // webpack 2 promise
    if (result && result.then) {
        result.then(function(updatedModules) {
            cb(null, updatedModules);
        });
        result.catch(cb);
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    if(unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(
          "[HMR] The following modules couldn't be hot updated: " +
          "(Full reload needed)\n" +
          "This is usually because the modules which have changed " +
          "(and their parents) do not know how to hot reload themselves. " +
          "See " + hmrDocsUrl + " for more details."
        );
        unacceptedModules.forEach(function(moduleId) {
          console.warn("[HMR]  - " + moduleMap[moduleId]);
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if(!renewedModules || renewedModules.length === 0) {
        console.log("[HMR] Nothing hot updated.");
      } else {
        console.log("[HMR] Updated modules:");
        renewedModules.forEach(function(moduleId) {
          console.log("[HMR]  - " + moduleMap[moduleId]);
        });
      }

      if (upToDate()) {
        console.log("[HMR] App is up to date.");
      }
    }
  }

  function handleError(err) {
    if (module.hot.status() in failureStatuses) {
      if (options.warn) {
        console.warn("[HMR] Cannot check for update (Full reload needed)");
        console.warn("[HMR] " + err.stack || err.message);
      }
      performReload();
      return;
    }
    if (options.warn) {
      console.warn("[HMR] Update check failed: " + err.stack || err.message);
    }
  }

  function performReload() {
    if (reload) {
      if (options.warn) console.warn("[HMR] Reloading page");
      window.location.reload();
    }
  }
};


/***/ })
/******/ ]);