editor_mappanel_wrapper = function (editor) {

    // 暂时先 注释+分类 内部函数未完成重构

    /**
     * 在绘图区格子内画一个随机色块
     */
    editor.uifunctions.fillPos = function (pos) {
        editor.dom.euiCtx.fillStyle = '#' + ~~(Math.random() * 8) + ~~(Math.random() * 8) + ~~(Math.random() * 8);
        editor.dom.euiCtx.fillRect(pos.x * 32 + 12 - core.bigmap.offsetX, pos.y * 32 + 12 - core.bigmap.offsetY, 8, 8);
    }

    /**
     * 从鼠标点击返回可用的组件内坐标
     */
    editor.uifunctions.eToLoc = function (e) {
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        var xx = e.clientX, yy = e.clientY
        if (editor.isMobile) { xx = e.touches[0].clientX, yy = e.touches[0].clientY }
        editor.loc = {
            'x': scrollLeft + xx - editor.dom.mid.offsetLeft - editor.dom.mapEdit.offsetLeft,
            'y': scrollTop + yy - editor.dom.mid.offsetTop - editor.dom.mapEdit.offsetTop,
            'size': editor.isMobile ? (32 * innerWidth * 0.96 / core.__PIXELS__) : 32
        };
        return editor.loc;
    }

    /**
     * 组件内坐标转地图位置
     * @param {Boolean} addViewportOffset 是否加上大地图的偏置
     */
    editor.uifunctions.locToPos = function (loc, addViewportOffset) {
        var offsetX = 0, offsetY = 0;
        if (addViewportOffset) {
            offsetX = core.bigmap.offsetX / 32;
            offsetY = core.bigmap.offsetY / 32;
        }
        editor.pos = { 'x': ~~(loc.x / loc.size) + offsetX, 'y': ~~(loc.y / loc.size) + offsetY }
        return editor.pos;
    }

    /**
     * editor.dom.eui.ondblclick
     * 双击地图可以选中素材
     */
    editor.uifunctions.map_doubleClick = function (e) {
        var loc = editor.uifunctions.eToLoc(e);
        var pos = editor.uifunctions.locToPos(loc, true);
        editor.setSelectBoxFromInfo(editor[editor.layerMod][pos.y][pos.x]);
        return;
    }

    /**
     * 用于鼠标移出map后清除状态
     */
    editor.uifunctions.clearMapStepStatus = function () {
        if (editor.uivalues.mouseOutCheck > 1) {
            editor.uivalues.mouseOutCheck--;
            setTimeout(editor.uifunctions.clearMapStepStatus, 1000);
            return;
        }
        editor.uivalues.holdingPath = 0;
        editor.uivalues.stepPostfix = [];
        editor.dom.euiCtx.clearRect(0, 0, core.__PIXELS__, core.__PIXELS__);
        editor.uivalues.startPos = editor.uivalues.endPos = null;
    }

    /**
     * editor.dom.eui.onmousedown
     * + 右键进入菜单
     * + 非绘图时选中
     * + 绘图时画个矩形在那个位置
     */
    editor.uifunctions.map_ondown = function (e) {
        var loc = editor.uifunctions.eToLoc(e);
        var pos = editor.uifunctions.locToPos(loc, true);
        if (e.button == 2) {
            editor.uifunctions.showMidMenu(e.clientX, e.clientY);
            return false;
        }
        if (!selectBox.isSelected()) {
            editor_mode.onmode('nextChange');
            editor_mode.onmode('loc');
            //editor_mode.loc();
            //tip.whichShow(1);
            tip.showHelp(6);
            editor.uivalues.startPos = pos;
            editor.dom.euiCtx.strokeStyle = '#FF0000';
            editor.dom.euiCtx.lineWidth = 3;
            if (editor.isMobile) editor.uifunctions.showMidMenu(e.clientX, e.clientY);
            return false;
        }

        editor.uivalues.holdingPath = 1;
        editor.uivalues.mouseOutCheck = 2;
        setTimeout(editor.uifunctions.clearMapStepStatus);
        editor.dom.euiCtx.clearRect(0, 0, core.__PIXELS__, core.__PIXELS__);
        editor.uivalues.stepPostfix = [];
        editor.uivalues.stepPostfix.push(pos);
        editor.uifunctions.fillPos(pos);
        return false;
    }

    /**
     * editor.dom.eui.onmousemove
     * + 非绘图模式时维护起止位置并画箭头
     * + 绘图模式时找到与队列尾相邻的鼠标方向的点画个矩形
     */
    editor.uifunctions.map_onmove = function (e) {
        if (!selectBox.isSelected()) {
            if (editor.uivalues.startPos == null) return;
            //tip.whichShow(1);
            var loc = editor.uifunctions.eToLoc(e);
            var pos = editor.uifunctions.locToPos(loc, true);
            if (editor.uivalues.endPos != null && editor.uivalues.endPos.x == pos.x && editor.uivalues.endPos.y == pos.y) return;
            if (editor.uivalues.endPos != null) {
                editor.dom.euiCtx.clearRect(Math.min(32 * editor.uivalues.startPos.x - core.bigmap.offsetX, 32 * editor.uivalues.endPos.x - core.bigmap.offsetX),
                    Math.min(32 * editor.uivalues.startPos.y - core.bigmap.offsetY, 32 * editor.uivalues.endPos.y - core.bigmap.offsetY),
                    (Math.abs(editor.uivalues.startPos.x - editor.uivalues.endPos.x) + 1) * 32, (Math.abs(editor.uivalues.startPos.y - editor.uivalues.endPos.y) + 1) * 32)
            }
            editor.uivalues.endPos = pos;
            if (editor.uivalues.startPos != null) {
                if (editor.uivalues.startPos.x != editor.uivalues.endPos.x || editor.uivalues.startPos.y != editor.uivalues.endPos.y) {
                    core.drawArrow('eui',
                        32 * editor.uivalues.startPos.x + 16 - core.bigmap.offsetX, 32 * editor.uivalues.startPos.y + 16 - core.bigmap.offsetY,
                        32 * editor.uivalues.endPos.x + 16 - core.bigmap.offsetX, 32 * editor.uivalues.endPos.y + 16 - core.bigmap.offsetY);
                }
            }
            // editor_mode.onmode('nextChange');
            // editor_mode.onmode('loc');
            //editor_mode.loc();
            //tip.whichShow(1);
            // tip.showHelp(6);
            return false;
        }

        if (editor.uivalues.holdingPath == 0) {
            return false;
        }
        editor.uivalues.mouseOutCheck = 2;
        var loc = editor.uifunctions.eToLoc(e);
        var pos = editor.uifunctions.locToPos(loc, true);
        var pos0 = editor.uivalues.stepPostfix[editor.uivalues.stepPostfix.length - 1]
        var directionDistance = [pos.y - pos0.y, pos0.x - pos.x, pos0.y - pos.y, pos.x - pos0.x]
        var max = 0, index = 4;
        for (var i = 0; i < 4; i++) {
            if (directionDistance[i] > max) {
                index = i;
                max = directionDistance[i];
            }
        }
        var pos = [{ 'x': 0, 'y': 1 }, { 'x': -1, 'y': 0 }, { 'x': 0, 'y': -1 }, { 'x': 1, 'y': 0 }, false][index]
        if (pos) {
            pos.x += pos0.x;
            pos.y += pos0.y;
            editor.uivalues.stepPostfix.push(pos);
            editor.uifunctions.fillPos(pos);
        }
        return false;
    }

    /**
     * editor.dom.eui.onmouseup
     * + 非绘图模式时, 交换首末点的内容
     * + 绘图模式时, 根据画线/画矩形/画tileset 做对应的绘制
     */
    editor.uifunctions.map_onup = function (e) {
        if (!selectBox.isSelected()) {
            //tip.whichShow(1);
            // editor.movePos(editor.uivalues.startPos, editor.uivalues.endPos);
            if (editor.layerMod == 'map')
                editor.exchangePos(editor.uivalues.startPos, editor.uivalues.endPos);
            else
                editor.exchangeBgFg(editor.uivalues.startPos, editor.uivalues.endPos, editor.layerMod);
            editor.uivalues.startPos = editor.uivalues.endPos = null;
            editor.dom.euiCtx.clearRect(0, 0, core.__PIXELS__, core.__PIXELS__);
            return false;
        }
        editor.uivalues.holdingPath = 0;
        if (editor.uivalues.stepPostfix && editor.uivalues.stepPostfix.length) {
            editor.uivalues.preMapData = JSON.parse(JSON.stringify({ map: editor.map, fgmap: editor.fgmap, bgmap: editor.bgmap }));
            if (editor.brushMod !== 'line') {
                var x0 = editor.uivalues.stepPostfix[0].x;
                var y0 = editor.uivalues.stepPostfix[0].y;
                var x1 = editor.uivalues.stepPostfix[editor.uivalues.stepPostfix.length - 1].x;
                var y1 = editor.uivalues.stepPostfix[editor.uivalues.stepPostfix.length - 1].y;
                if (x0 > x1) { x0 ^= x1; x1 ^= x0; x0 ^= x1; }//swap
                if (y0 > y1) { y0 ^= y1; y1 ^= y0; y0 ^= y1; }//swap
                editor.uivalues.stepPostfix = [];
                for (var jj = y0; jj <= y1; jj++) {
                    for (var ii = x0; ii <= x1; ii++) {
                        editor.uivalues.stepPostfix.push({ x: ii, y: jj })
                    }
                }
            }
            editor.uivalues.currDrawData.pos = JSON.parse(JSON.stringify(editor.uivalues.stepPostfix));
            editor.uivalues.currDrawData.info = JSON.parse(JSON.stringify(editor.info));
            editor.uivalues.reDo = null;
            // console.log(editor.uivalues.stepPostfix);
            if (editor.brushMod === 'tileset' && core.tilesets.indexOf(editor.info.images) !== -1) {
                var imgWidth = ~~(core.material.images.tilesets[editor.info.images].width / 32);
                var x0 = editor.uivalues.stepPostfix[0].x;
                var y0 = editor.uivalues.stepPostfix[0].y;
                var idnum = editor.info.idnum;
                for (var ii = 0; ii < editor.uivalues.stepPostfix.length; ii++) {
                    if (editor.uivalues.stepPostfix[ii].y != y0) {
                        y0++;
                        idnum += imgWidth;
                    }
                    editor[editor.layerMod][editor.uivalues.stepPostfix[ii].y][editor.uivalues.stepPostfix[ii].x] = editor.ids[editor.indexs[idnum + editor.uivalues.stepPostfix[ii].x - x0]];
                }
            } else {
                for (var ii = 0; ii < editor.uivalues.stepPostfix.length; ii++)
                    editor[editor.layerMod][editor.uivalues.stepPostfix[ii].y][editor.uivalues.stepPostfix[ii].x] = editor.info;
            }
            // console.log(editor.map);
            editor.updateMap();
            editor.uivalues.holdingPath = 0;
            editor.uivalues.stepPostfix = [];
            editor.dom.euiCtx.clearRect(0, 0, core.__PIXELS__, core.__PIXELS__);
        }
        return false;
    }

    /**
     * editor.dom.mid.onmousewheel
     * 在地图编辑区域滚轮切换楼层
     */
    editor.uifunctions.map_mousewheel = function (e) {
        var wheel = function (direct) {
            var index = editor.core.floorIds.indexOf(editor.currentFloorId);
            var toId = editor.currentFloorId;

            if (direct > 0 && index < editor.core.floorIds.length - 1)
                toId = editor.core.floorIds[index + 1];
            else if (direct < 0 && index > 0)
                toId = editor.core.floorIds[index - 1];
            else return;

            editor_mode.onmode('nextChange');
            editor_mode.onmode('floor');
            editor.dom.selectFloor.value = toId;
            editor.changeFloor(toId);
        }

        try {
            if (e.wheelDelta)
                wheel(Math.sign(e.wheelDelta))
            else if (e.detail)
                wheel(Math.sign(e.detail));
        }
        catch (ee) {
            console.log(ee);
        }
        return false;
    }

    /**
     * 显示右键菜单
     */
    editor.uifunctions.showMidMenu = function (x, y) {
        editor.uivalues.lastRightButtonPos = JSON.parse(JSON.stringify(
            [editor.pos, editor.uivalues.lastRightButtonPos[0]]
        ));
        // --- copy
        editor.uivalues.lastCopyedInfo = [editor.copyFromPos(), editor.uivalues.lastCopyedInfo[0]];
        var locStr = '(' + editor.uivalues.lastRightButtonPos[1].x + ',' + editor.uivalues.lastRightButtonPos[1].y + ')';
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

        // 检测是否是上下楼
        var thisevent = editor.map[editor.pos.y][editor.pos.x];
        if (thisevent.id == 'upFloor') {
            editor.dom.addFloorEvent.style.display = 'block';
            editor.dom.addFloorEvent.children[0].innerHTML = '绑定上楼事件';
        }
        else if (thisevent.id == 'downFloor') {
            editor.dom.addFloorEvent.style.display = 'block';
            editor.dom.addFloorEvent.children[0].innerHTML = '绑定下楼事件';
        }
        else if (['leftPortal', 'rightPortal', 'downPortal', 'upPortal'].indexOf(thisevent.id) >= 0) {
            editor.dom.addFloorEvent.style.display = 'block';
            editor.dom.addFloorEvent.children[0].innerHTML = '绑定楼传事件';
        }
        else editor.dom.addFloorEvent.style.display = 'none';

        editor.dom.chooseThis.children[0].innerHTML = '选中此点' + '(' + editor.pos.x + ',' + editor.pos.y + ')'
        editor.dom.copyLoc.children[0].innerHTML = '复制事件' + locStr + '到此处';
        editor.dom.moveLoc.children[0].innerHTML = '交换事件' + locStr + '与此事件的位置';
        editor.dom.midMenu.style = 'top:' + (y + scrollTop) + 'px;left:' + (x + scrollLeft) + 'px;';
    }

    /**
     * 隐藏右键菜单
     */
    editor.uifunctions.hideMidMenu = function () {
        if (editor.isMobile) {
            setTimeout(function () {
                editor.dom.midMenu.style = 'display:none';
            }, 200)
        } else {
            editor.dom.midMenu.style = 'display:none';
        }
    }

    /**
     * editor.dom.addFloorEvent.onmousedown
     * 菜单 添加上下楼事件
     */
    editor.addFloorEvent_click = function (e) {
        editor.uifunctions.hideMidMenu();
        e.stopPropagation();
        var thisevent = editor.map[editor.pos.y][editor.pos.x];
        var loc = editor.pos.x + "," + editor.pos.y;
        if (thisevent.id == 'upFloor') {
            editor.currentFloorData.changeFloor[loc] = { "floorId": ":next", "stair": "downFloor" };
        }
        else if (thisevent.id == 'downFloor') {
            editor.currentFloorData.changeFloor[loc] = { "floorId": ":before", "stair": "upFloor" };
        }
        else if (thisevent.id == 'leftPortal' || thisevent.id == 'rightPortal') {
            editor.currentFloorData.changeFloor[loc] = { "floorId": ":next", "stair": ":symmetry_x" }
        }
        else if (thisevent.id == 'upPortal' || thisevent.id == 'downPortal') {
            editor.currentFloorData.changeFloor[loc] = { "floorId": ":next", "stair": ":symmetry_y" }
        }
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw (err)
            }
            editor.drawPosSelection();
            editor_mode.showMode('loc');
            printf('添加楼梯事件成功');
        });
    }

    /**
     * editor.dom.chooseThis.onmousedown
     * 菜单 选中此点
     */
    editor.uifunctions.chooseThis_click = function (e) {
        editor.uifunctions.hideMidMenu();
        e.stopPropagation();
        selectBox.isSelected(false);

        editor_mode.onmode('nextChange');
        editor_mode.onmode('loc');
        //editor_mode.loc();
        //tip.whichShow(1);
        if (editor.isMobile) editor.showdataarea(false);
    }

    /**
     * editor.dom.chooseInRight.onmousedown
     * 菜单 在素材区选中此图块
     */
    editor.uifunctions.chooseInRight_click = function (e) {
        editor.uifunctions.hideMidMenu();
        e.stopPropagation();
        var thisevent = editor[editor.layerMod][editor.pos.y][editor.pos.x];
        editor.setSelectBoxFromInfo(thisevent);
    }

    /**
     * editor.dom.copyLoc.onmousedown
     * 菜单 复制此事件
     */
    editor.uifunctions.copyLoc_click = function (e) {
        editor.uifunctions.hideMidMenu();
        e.stopPropagation();
        editor.uivalues.preMapData = null;
        editor.uivalues.reDo = null;
        editor_mode.onmode('');
        var now = editor.pos, last = editor.uivalues.lastRightButtonPos[1];
        if (now.x == last.x && now.y == last.y) return;
        editor.pasteToPos(editor.uivalues.lastCopyedInfo[1]);
        editor.updateMap();
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw (err)
            }
            ; printf('复制事件成功');
            editor.drawPosSelection();
        });
    }

    /**
     * editor.dom.moveLoc.onmousedown
     * 菜单 移动此事件
     */
    editor.uifunctions.moveLoc_click = function (e) {
        editor.uifunctions.hideMidMenu();
        e.stopPropagation();
        editor.uivalues.preMapData = null;
        editor.uivalues.reDo = null;
        editor_mode.onmode('');
        editor.exchangePos(editor.pos, editor.uivalues.lastRightButtonPos[1]);
    }

    /**
     * editor.dom.clearEvent.onmousedown
     * 菜单 仅清空此点事件
     */
    editor.uifunctions.clearEvent_click = function (e) {
        e.stopPropagation();
        editor.uivalues.reDo = null;
        editor.clearPos(false);
    }

    /**
     * editor.dom.clearLoc.onmousedown
     * 菜单 清空此点及事件
     */
    editor.uifunctions.clearLoc_click = function (e) {
        e.stopPropagation();
        editor.uivalues.reDo = null;
        editor.clearPos(true);
    }

    /**
     * editor.dom.brushMod.onchange
     * 切换画笔模式
     */
    editor.uifunctions.brushMod_onchange = function () {
        editor.brushMod = editor.dom.brushMod.value;
    }

    /**
     * editor.dom.brushMod2.onchange
     * 切换画笔模式
     */
    editor.uifunctions.brushMod2_onchange = function () {
        editor.brushMod = editor.dom.brushMod2.value;
    }

    /**
     * editor.dom.brushMod3.onchange
     * 切换画笔模式
     */
    editor.uifunctions.brushMod3_onchange = function () {
        // tip.showHelp(5)
        tip.isSelectedBlock(false)
        tip.msgs[11] = String('tileset贴图模式下可以按选中tileset素材，并在地图上拖动来一次绘制一个区域');
        tip.whichShow(12);
        editor.brushMod = editor.dom.brushMod3.value;
    }

    /**
     * editor.dom.layerMod.onchange
     * 切换编辑的层
     */
    editor.uifunctions.layerMod_onchange = function () {
        editor.layerMod = editor.dom.layerMod.value;
        [editor.dom.bgc, editor.dom.fgc, editor.dom.evc, editor.dom.ev2c].forEach(function (x) {
            x.style.opacity = 1;
        });

        // 手机端....
        if (editor.isMobile) {
            if (editor.dom.layerMod.value == 'bgmap') {
                [editor.dom.fgc, editor.dom.evc, editor.dom.ev2c].forEach(function (x) {
                    x.style.opacity = 0.3;
                });
            }
            if (editor.dom.layerMod.value == 'fgmap') {
                [editor.dom.bgc, editor.dom.evc, editor.dom.ev2c].forEach(function (x) {
                    x.style.opacity = 0.3;
                });
            }
        }
    }

    /**
     * editor.dom.layerMod2.onchange
     * 切换编辑的层
     */
    editor.uifunctions.layerMod2_onchange = function () {
        editor.layerMod = editor.dom.layerMod2.value;
        [editor.dom.fgc, editor.dom.evc, editor.dom.ev2c].forEach(function (x) {
            x.style.opacity = 0.3;
        });
        editor.dom.bgc.style.opacity = 1;
    }

    /**
     * editor.dom.layerMod3.onchange
     * 切换编辑的层
     */
    editor.uifunctions.layerMod3_onchange = function () {
        editor.layerMod = editor.dom.layerMod3.value;
        [editor.dom.bgc, editor.dom.evc, editor.dom.ev2c].forEach(function (x) {
            x.style.opacity = 0.3;
        });
        editor.dom.fgc.style.opacity = 1;
    }

    /**
     * 移动大地图可视窗口的绑定
     */
    editor.uifunctions.viewportButtons_func = function () {
        var pressTimer = null;
        for (var ii = 0, node; node = editor.dom.viewportButtons.children[ii]; ii++) {
            (function (x, y) {
                var move = function () {
                    editor.moveViewport(x, y);
                }
                node.onmousedown = function () {
                    clearTimeout(pressTimer);
                    pressTimer = setTimeout(function () {
                        pressTimer = -1;
                        var f = function () {
                            if (pressTimer != null) {
                                move();
                                setTimeout(f, 150);
                            }
                        }
                        f();
                    }, 500);
                };
                node.onmouseup = function () {
                    if (pressTimer > 0) {
                        clearTimeout(pressTimer);
                        move();
                    }
                    pressTimer = null;
                }
            })([-1, 0, 0, 1][ii], [0, -1, 1, 0][ii]);
        }
    }

    editor.uifunctions.selectFloor_func = function () {
        var selectFloor = document.getElementById('selectFloor');
        editor.game.getFloorFileList(function (floors) {
            var outstr = [];
            floors[0].forEach(function (floor) {
                outstr.push(["<option value='", floor, "'>", floor, '</option>\n'].join(''));
            });
            selectFloor.innerHTML = outstr.join('');
            selectFloor.value = core.status.floorId;
            selectFloor.onchange = function () {
                editor_mode.onmode('nextChange');
                editor_mode.onmode('floor');
                editor.changeFloor(selectFloor.value);
            }
        });
    }


    editor.uifunctions.saveFloor_func = function () {
        var saveFloor = document.getElementById('saveFloor');
        editor_mode.saveFloor = function () {
            editor_mode.onmode('');
            editor.file.saveFloorFile(function (err) {
                if (err) {
                    printe(err);
                    throw (err)
                }
                ; printf('保存成功');
            });
        }
        saveFloor.onclick = editor_mode.saveFloor;
    }



    /////////////////////////////////////////////////////////////////////////////


    editor.constructor.prototype.copyFromPos = function (pos) {
        var fields = Object.keys(editor.file.comment._data.floors._data.loc._data);
        pos = pos || editor.pos;
        var map = core.clone(editor.map[pos.y][pos.x]);
        var events = {};
        fields.forEach(function(v){
            events[v] = core.clone(editor.currentFloorData[v][pos.x+','+pos.y]);
        })
        return {map: map, events: events};
    }
    
    editor.constructor.prototype.pasteToPos = function (info, pos) {
        if (info == null) return;
        var fields = Object.keys(editor.file.comment._data.floors._data.loc._data);
        pos = pos || editor.pos;
        editor.map[pos.y][pos.x] = core.clone(info.map);
        fields.forEach(function(v){
            if (info.events[v] == null) delete editor.currentFloorData[v][pos.x+","+pos.y];
            else editor.currentFloorData[v][pos.x+","+pos.y] = core.clone(info.events[v]);
        });
    }
    
    editor.constructor.prototype.movePos = function (startPos, endPos, callback) {
        if (!startPos || !endPos) return;
        if (startPos.x == endPos.x && startPos.y == endPos.y) return;
        var copyed = editor.copyFromPos(startPos);
        editor.pasteToPos({map:0, events: {}}, startPos);
        editor.pasteToPos(copyed, endPos);
        editor.updateMap();
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw(err)
            }
            ;printf('移动事件成功');
            editor.drawPosSelection();
            if (callback) callback();
        });
    }
    
    editor.constructor.prototype.exchangePos = function (startPos, endPos, callback) {
        if (!startPos || !endPos) return;
        if (startPos.x == endPos.x && startPos.y == endPos.y) return;
        var startInfo = editor.copyFromPos(startPos);
        var endInfo = editor.copyFromPos(endPos);
        editor.pasteToPos(startInfo, endPos);
        editor.pasteToPos(endInfo, startPos);
        editor.updateMap();
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw(err)
            }
            ;printf('交换事件成功');
            editor.drawPosSelection();
            if (callback) callback();
        });
    }
    
    editor.constructor.prototype.moveBgFg = function (startPos, endPos, name, callback) {
        if (!startPos || !endPos || ["bgmap","fgmap"].indexOf(name)<0) return;
        if (startPos.x == endPos.x && startPos.y == endPos.y) return;
        editor[name][endPos.y][endPos.x] = editor[name][startPos.y][startPos.x];
        editor[name][startPos.y][startPos.x] = 0;
        editor.updateMap();
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw(err)
            }
            ;printf('移动图块成功');
            editor.drawPosSelection();
            if (callback) callback();
        });
    }
    
    editor.constructor.prototype.exchangeBgFg = function (startPos, endPos, name, callback) {
        if (!startPos || !endPos || ["bgmap","fgmap"].indexOf(name)<0) return;
        if (startPos.x == endPos.x && startPos.y == endPos.y) return;
        var value = editor[name][endPos.y][endPos.x];
        editor[name][endPos.y][endPos.x] = editor[name][startPos.y][startPos.x];
        editor[name][startPos.y][startPos.x] = value;
        editor.updateMap();
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw(err)
            }
            ;printf('交换图块成功');
            editor.drawPosSelection();
            if (callback) callback();
        });
    
    }
    
    editor.constructor.prototype.clearPos = function (clearPos, pos, callback) {
        var fields = Object.keys(editor.file.comment._data.floors._data.loc._data);
        pos = pos || editor.pos;
        editor.uifunctions.hideMidMenu();
        editor.uivalues.preMapData = null;
        editor.info = 0;
        editor_mode.onmode('');
        if (clearPos)
            editor.map[pos.y][pos.x]=editor.info;
        editor.updateMap();
        fields.forEach(function(v){
            delete editor.currentFloorData[v][pos.x+','+pos.y];
        })
        editor.file.saveFloorFile(function (err) {
            if (err) {
                printe(err);
                throw(err)
            }
            ;printf(clearPos?'清空该点和事件成功':'只清空该点事件成功');
            editor.drawPosSelection();
            if (callback) callback();
        });
    }


















}