main.floors.event=
{
    "floorId": "event",
    "title": "主塔 0 层",
    "name": "0",
    "width": 13,
    "height": 13,
    "canFlyTo": true,
    "canUseQuickShop": true,
    "cannotViewMap": false,
    "images": [],
    "item_ratio": 1,
    "defaultGround": "ground",
    "firstArrive": [],
    "eachArrive": [],
    "parallelDo": "",
    "events": {
        "0,0": [
            {
                "type": "comment",
                "text": "flag:turn，0代表当前我方，1代表当前对方"
            },
            {
                "type": "comment",
                "text": "flag:choose，当前选中的怪物索引"
            },
            {
                "type": "setValue",
                "name": "flag:turn",
                "value": "0"
            },
            {
                "type": "setValue",
                "name": "flag:choose",
                "value": "null"
            },
            {
                "type": "while",
                "condition": "1",
                "data": [
                    {
                        "type": "while",
                        "condition": "1",
                        "data": [
                            {
                                "type": "insert",
                                "name": "等待操作"
                            },
                            {
                                "type": "if",
                                "condition": "flag:choose==null",
                                "true": [
                                    {
                                        "type": "comment",
                                        "text": "选择一个新怪物"
                                    },
                                    {
                                        "type": "setValue",
                                        "name": "flag:temp",
                                        "value": "core.getMonster(flag:x, flag:y)"
                                    },
                                    {
                                        "type": "if",
                                        "condition": "flag:temp == null || flag:temp[0] != flag:turn",
                                        "true": [
                                            {
                                                "type": "continue"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "setValue",
                                        "name": "flag:choose",
                                        "value": "flag:temp[1]"
                                    },
                                    {
                                        "type": "setValue",
                                        "name": "flag:obj",
                                        "value": "core.getMonsterObj()"
                                    },
                                    {
                                        "type": "update"
                                    },
                                    {
                                        "type": "break"
                                    }
                                ],
                                "false": [
                                    {
                                        "type": "comment",
                                        "text": "二次操作该怪物"
                                    },
                                    {
                                        "type": "function",
                                        "function": "function(){\ncore.getMonsterObj()\n}"
                                    },
                                    {
                                        "type": "if",
                                        "condition": "core.isValidStep(flag:x, flag:y)",
                                        "true": []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    "changeFloor": {},
    "afterBattle": {},
    "afterGetItem": {},
    "afterOpenDoor": {},
    "cannotMove": {},
    "map": [
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
],
    "bgmap": [

],
    "fgmap": [

]
}