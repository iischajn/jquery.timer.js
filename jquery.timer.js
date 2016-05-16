(function($) {
    var delayList = {};
    var countIndex = 0;

    function countdown(time, proc, end) {
        var num = time || 5;
        var id = '__countdown' + (++countIndex) + '__';
        loop(id, 1000, function() {
            if (num <= 0) {
                end && end(num);
                return false;
            }

            proc && proc(num);
            num--;
            return true;
        });
    }

    function delay(id, ms, proc) {
        delayList[id] = setTimeout(proc, ms);
    }

    function undelay(id) {
        clearTimeout(delayList[id]);
    }

    function loop(id, ms, proc, count) {
        count = count || 0;
        delay(id, ms, function() {
            count = count + 1;
            var isProc = proc(count);
            isProc && loop(id, ms, proc, count);
        });
    }

    function unloop(id) {
        clearTimeout(delayList[id]);
    }

    function reg_format(date, fmt) {
        var o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }

        return fmt;
    }

    function addZero(data) {
        if (data <= 9) {
            data = "0" + data;
        }
        return data;
    }

    function time_format(second) {
        var sec = addZero(parseInt(second % 60, 10));
        var min = addZero(parseInt(second % 3600 / 60, 10));
        var hour = addZero(parseInt(second % (3600 * 24) / 3600, 10));
        var s = hour + ":" + min + ":" + sec;
        return s;
    }

    function meter(step) {
        var isActive = false;
        var time = 0;

        var that = {
            set: set,
            start: start,
            finish: finish,
            stop: stop,
            doing: doing
        };

        function set(sec) {
            time = sec;
        }

        function go() {
            if (isActive) {
                time = time + 1;
                step && step(time);
                $timeout(go, 1000);
            }
        }

        function start() {
            isActive = true;
            time = 0;
            go();
        }

        function stop() {
            isActive = false;
        }

        function finish() {
            isActive = false;
            time = 0;
        }

        function doing() {
            isActive = true;
            go();
        }
        return that;
    }

    function midnight() {
        var midnight = new Date();
        midnight.setDate(midnight.getDate() + 1);
        midnight.setHours(0, 0, 0, 0);
        return midnight;
    }
    $.Timer = {
        meter: meter,
        countdown: countdown,
        delay: delay,
        undelay: undelay,
        loop: loop,
        unloop: unloop,
        midnight: midnight,
        reg_format: reg_format,
        time_format: time_format
    };
}(jQuery));
