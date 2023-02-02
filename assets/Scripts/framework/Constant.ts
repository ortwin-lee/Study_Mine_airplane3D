export class Constant {
    //box range
    public static BackgroundRange = {
        Top: -50,
        Bottom: 45,
        Right: 23,
        Left: -23
    };

    /*enemy
     *     时间 | 0~10 | 11~20  |   20+   |
     *     组合 |  1   | 1、2   | 1、2、3 |
     *  组合间隔|   1  |  0.8   |   0.6   |
     **/
    public static EnemyType = {
        TYPE1: 1,       //慢
        TYPE2: 2        //快
    };

    public static EnemyCombination = {
        KIND1: 1,   //单架飞机
        KIND2: 2,   //一字型飞机（5）
        KIND3: 3    //v字型飞机（7）
    };

    public static EnemySpeed = {
        one: 0.5,
        two: 0.7
    };

    public static EnemyCombinationInterval = {
        CombinationKind1: 1,
        CombinationKind2: 0.8,
        CombinationKind3: 0.6
    };


    //bullet
    public static BulletSpeed = {
        PlayerOne: -1,
        EnemyOne: 1,
        XOffset: 0.3
    };

    public static Direction = {
        LEFT: 1,
        MIDDLE: 2,
        RIGHT: 3,
    };

    public static BulletPropType = {
        BULLET_M: 1,
        BULLET_H: 2,
        BULLET_S: 3
    }

    //collision
    public static CollisionType = {
        DEFAULT: 1 << 0,
        SELF_PLANE: 1 << 1,
        ENEMY_PLANE: 1 << 2,
        SELF_BULLET: 1 << 3,
        ENEMY_BULLET: 1 << 4,
        BULLET_PROP: 1<<5
    }
}


