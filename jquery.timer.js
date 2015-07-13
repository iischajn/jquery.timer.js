(function($) {
	var delayList = {};
	var countIndex = 0;

	function countdown(time, proc, end){
		var num = time || 5;
		var id = '__countdown'+(++countIndex)+'__';
		loop(id, 1000, function(){
			if(num == 0){
				end && end();
				return false;
			}else{
				num--;
				proc && proc(num);
				return true;	    					
			}
		});
	}

	function delay(id, ms, proc){
		delayList[id] = setTimeout(proc, ms);
	}

	function undelay(id){
		clearTimeout(delayList[id]);
	}

	function loop(id, ms, proc){
		delay(id, ms, function(){
			var isProc = proc();
			isProc && loop(id, ms, proc);
		});
	}

	function unloop(id){
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

    function addZero(data){
        if (data <= 9) {
            data = "0" + data;
        }
        return data;
    }

    function time_format(ms){
    	var second = ms/1000;
    	var sec = addZero(parseInt(second%60,10));
        var min = addZero(parseInt(second%3600/60,10));
        var hour = addZero(parseInt(second%(3600*24)/3600,10));
		var s = hour + ":" + min + ":" + sec;
        return s;
    }

	function countdownByDate(start_ms, end_ms, cb){
		var timer, that = {};
        var scheduleTime = new Date(start_ms);
        var endTime = new Date(end_ms);
        var isActive = false;

	    function check(nowTime){
	    	var status = 'todo';
	        var time =  scheduleTime - nowTime;
	        if(time <= 0){
	            if(nowTime < endTime){
	                status = 'doing';
	                time = endTime - nowTime;
	            }else{
	                status = 'done';
	                time = nowTime - endTime;
	            }
	        }
	        return {
	        	status:status,
	        	time:time
	        };
	    };
	    function go(){
	        var nowTime = new Date();
	        var timeObj = check(nowTime);
	        timeObj.time = time_format(timeObj.time);
	        cb && cb(timeObj);
	        isActive && setTimeout(go, 1000);
	    }

	    function start(){
	    	isActive = true;
	    	go();
	    }
	    function stop(){
	    	isActive = false;
	    }
	    return {
	    	start:start,
	    	check:check,
	    	stop:stop
	    };
	}
	function midnight(){
		var midnight = new Date();
        midnight.setDate(midnight.getDate() + 1);
        midnight.setHours(0,0,0,0);
        return midnight;
	}
	$.Timer = {
		countdown:countdown,
		countdownByDate:countdownByDate,
		delay:delay,
		undelay:undelay,
		loop:loop,
		unloop:unloop,
		midnight:midnight,
		reg_format:reg_format,
		time_format:time_format
	};
}(jQuery));


