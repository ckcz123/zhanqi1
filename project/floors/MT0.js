main.floors.MT0=
{
    "floorId": "MT0",
    "title": "主塔 0 层",
    "name": "0",
    "canFlyTo": true,
    "canUseQuickShop": true,
    "cannotViewMap": false,
    "defaultGround": "ground",
    "images": [],
    "item_ratio": 1,
    "map": [
    [  4,  4,  4,  4,  4,  4,  0,  4,  4,  4,  4,  4,  4],
    [  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4],
    [  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4],
    [  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4],
    [  4,  0,  0,  0,  0,  4,  0,  4,  0,  0,  0,  0,  4],
    [  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4],
    [  4,  0,  0,  0,  4,  0,  0,  0,  4,  0,  0,  0,  4],
    [  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4],
    [  4,  0,  0,  0,  0,  4,  0,  4,  0,  0,  0,  0,  4],
    [  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4],
    [  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4],
    [  4,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4],
    [  4,  4,  4,  4,  4,  4,  0,  4,  4,  4,  4,  4,  4]
],
    "firstArrive": [],
    "parallelDo": "",
    "events": {},
    "changeFloor": {},
    "afterBattle": {},
    "afterGetItem": {},
    "afterOpenDoor": {},
    "cannotMove": {},
    "bgmap": [

],
    "fgmap": [

],
    "width": 13,
    "height": 13,
    "eachArrive": [
        {
            "type": "if",
            "condition": "flag:mode==0",
            "true": [
                {
                    "type": "function",
                    "function": "function(){\ncore.initMonsters();\n}"
                },
                {
                    "type": "comment",
                    "text": "flag:turn，flag:choose，flag:temp，flag:obj，flag:me"
                },
                {
                    "type": "insert",
                    "name": "主循环"
                }
            ],
            "false": [
                {
                    "type": "function",
                    "function": "function(){\ncore.initSocket()\n}"
                },
                "请输入房间号（存在则加入，不存在则建房）。\n也可以直接点取消进入匹配模式。",
                {
                    "type": "input",
                    "text": "请输入房间号"
                },
                {
                    "type": "function",
                    "function": "function(){\ncore.connect()\n}"
                },
                {
                    "type": "while",
                    "condition": "true",
                    "data": [
                        {
                            "type": "autoText",
                            "text": "正在等待其他玩家加入，请稍后...\n刷新界面以退出。",
                            "time": 250
                        }
                    ]
                },
                {
                    "type": "insert",
                    "name": "主循环"
                }
            ]
        }
    ]
}