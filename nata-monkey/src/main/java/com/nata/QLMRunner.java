package com.nata;

import com.nata.cmd.AdbDevice;
import com.nata.monkeys.AbstractMonkey;
import com.nata.monkeys.QLearningMonkey;
import com.nata.monkeys.RandomMonkey;

/**
 * Author: Calvin Meng
 * Blog: mclspace.com  Email: rdmclin2@gamil.com
 * Update: 2016-01-19 16:15
 */
public class QLMRunner {
    public static void main(String[] args) {
        String pkg = "com.zhihu.android";
        String act = ".app.ui.activity.MainActivity";

        //Set Monkey settings
        AdbDevice device = new AdbDevice();
        AbstractMonkey qLearningMonkey= new QLearningMonkey(pkg,act,device);

        //Start run monkey
        qLearningMonkey.play();

        //Do report
        qLearningMonkey.report();
    }
}
