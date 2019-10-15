editor_materialpanel_wrapper = function (editor) {

    editor.uifunctions.getScrollBarHeight = function () {
        var outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

        document.body.appendChild(outer);

        var widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = "scroll";

        // add innerdiv
        var inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);

        var widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    }

    /**
     * editor.dom.iconExpandBtn.onclick
     */
    editor.uifunctions.fold_material_click = function () {
        if (confirm(editor.uivalues.folded ? "你想要展开素材吗？\n展开模式下将显示全素材内容。"
            : ("你想要折叠素材吗？\n折叠模式下每个素材将仅显示单列，并且每" + editor.uivalues.foldPerCol + "个自动换列。"))) {
            core.setLocalStorage('folded', !editor.uivalues.folded);
            window.location.reload();
        }
    }

    /**
     * editor.dom.iconLib.onmousedown
     * 素材区的单击事件
     */
    editor.uifunctions.material_ondown = function (e) {
        e.stopPropagation();
        if (!editor.isMobile && e.clientY >= editor.dom.iconLib.offsetHeight - editor.uivalues.scrollBarHeight) return;
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var loc = {
            'x': scrollLeft + e.clientX + editor.dom.iconLib.scrollLeft - right.offsetLeft - editor.dom.iconLib.offsetLeft,
            'y': scrollTop + e.clientY + editor.dom.iconLib.scrollTop - right.offsetTop - editor.dom.iconLib.offsetTop,
            'size': 32
        };
        editor.loc = loc;
        var pos = editor.uifunctions.locToPos(loc);
        for (var spriter in editor.widthsX) {
            if (pos.x >= editor.widthsX[spriter][1] && pos.x < editor.widthsX[spriter][2]) {
                var ysize = spriter.endsWith('48') ? 48 : 32;
                loc.ysize = ysize;
                pos.images = editor.widthsX[spriter][0];
                pos.y = ~~(loc.y / loc.ysize);
                if (!editor.uivalues.folded && core.tilesets.indexOf(pos.images) == -1) pos.x = editor.widthsX[spriter][1];
                var autotiles = core.material.images['autotile'];
                if (pos.images == 'autotile') {
                    var imNames = Object.keys(autotiles);
                    if ((pos.y + 1) * ysize > editor.widthsX[spriter][3])
                        pos.y = ~~(editor.widthsX[spriter][3] / ysize) - 4;
                    else {
                        for (var i = 0; i < imNames.length; i++) {
                            if (pos.y >= 4 * i && pos.y < 4 * (i + 1)) {
                                pos.images = imNames[i];
                                pos.y = 4 * i;
                            }
                        }
                    }
                }
                else {
                    var height = editor.widthsX[spriter][3], col = height / ysize;
                    if (editor.uivalues.folded && core.tilesets.indexOf(pos.images) == -1) {
                        col = (pos.x == editor.widthsX[spriter][2] - 1) ? ((col - 1) % editor.uivalues.foldPerCol + 1) : editor.uivalues.foldPerCol;
                    }
                    if (spriter == 'terrains' && pos.x == editor.widthsX[spriter][1]) col += 2;
                    pos.y = Math.min(pos.y, col - 1);
                }

                selectBox.isSelected(true);
                // console.log(pos,core.material.images[pos.images].height)
                editor.dom.dataSelection.style.left = pos.x * 32 + 'px';
                editor.dom.dataSelection.style.top = pos.y * ysize + 'px';
                editor.dom.dataSelection.style.height = ysize - 6 + 'px';

                if (pos.x == 0 && pos.y == 0) {
                    // editor.info={idnum:0, id:'empty','images':'清除块', 'y':0};
                    editor.info = 0;
                } else if (pos.x == 0 && pos.y == 1) {
                    editor.info = editor.ids[editor.indexs[17]];
                } else {
                    if (autotiles[pos.images]) editor.info = { 'images': pos.images, 'y': 0 };
                    else if (core.tilesets.indexOf(pos.images) != -1) editor.info = { 'images': pos.images, 'y': pos.y, 'x': pos.x - editor.widthsX[spriter][1] };
                    else {
                        var y = pos.y;
                        if (editor.uivalues.folded) {
                            y += editor.uivalues.foldPerCol * (pos.x - editor.widthsX[spriter][1]);
                        }
                        if (pos.images == 'terrains' && pos.x == 0) y -= 2;
                        editor.info = { 'images': pos.images, 'y': y }
                    }

                    for (var ii = 0; ii < editor.ids.length; ii++) {
                        if ((core.tilesets.indexOf(pos.images) != -1 && editor.info.images == editor.ids[ii].images
                            && editor.info.y == editor.ids[ii].y && editor.info.x == editor.ids[ii].x)
                            || (Object.prototype.hasOwnProperty.call(autotiles, pos.images) && editor.info.images == editor.ids[ii].id
                                && editor.info.y == editor.ids[ii].y)
                            || (core.tilesets.indexOf(pos.images) == -1 && editor.info.images == editor.ids[ii].images
                                && editor.info.y == editor.ids[ii].y)
                        ) {

                            editor.info = editor.ids[ii];
                            break;
                        }
                    }
                }
                tip.infos(JSON.parse(JSON.stringify(editor.info)));
                editor_mode.onmode('nextChange');
                editor_mode.onmode('enemyitem');
                //editor_mode.enemyitem();
            }
        }
    }

}