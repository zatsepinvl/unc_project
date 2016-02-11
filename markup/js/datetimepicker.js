(function(e){"use strict";var t="ngMaterialDatePicker";var a={DATE:0,HOUR:1,MINUTE:2};var r=function(e,t){if("jQuery"in window){return jQuery(e).css(t)}else{e=angular.element(e);return"getComputedStyle"in window?window.getComputedStyle(e[0])[t]:e.css(t)}};e.locale("en");var i='<md-dialog class="dtp" layout="column" style="width: 300px;">'+'    <md-dialog-content class="dtp-content">'+'        <div class="dtp-date-view">'+'            <header class="dtp-header">'+'                <div class="dtp-actual-day" ng-show="picker.dateMode">{{picker.currentDate.format("dddd")}}</div>'+'                <div class="dtp-actual-day" ng-show="picker.timeMode">{{picker.params.shortTime ? picker.currentDate.format("A") : " "}}</div>'+'                <div class="dtp-close text-right">'+'                    <a href="#" mdc-dtp-noclick ng-click="picker.hide()">&times;</a>'+"                </div>"+"            </header>"+'            <div class="dtp-date" ng-show="picker.params.date">'+'                <div layout="column">'+'                    <div class="dtp-actual-month">{{picker.currentDate.format("MMM") | uppercase}}</div>'+"                </div>"+'                <div class="dtp-actual-num">{{picker.currentDate.format("DD")}}</div>'+'                <div layout="column">'+'                    <div class="dtp-actual-year">{{picker.currentDate.format("YYYY")}}</div>'+"                </div>"+"            </div>"+'            <div class="dtp-time" ng-show="picker.params.time && !picker.params.date">'+'                <div class="dtp-actual-maxtime">{{picker.currentNearest5Minute().format(picker.params.shortTime ? "hh:mm" : "HH:mm")}}</div>'+"            </div>"+'            <div class="dtp-picker">'+'                <mdc-datetime-picker-calendar date="picker.currentDate" picker="picker" class="dtp-picker-calendar" ng-show="picker.currentView === picker.VIEWS.DATE"></mdc-datetime-picker-calendar>'+'                <div class="dtp-picker-datetime" ng-show="picker.currentView !== picker.VIEWS.DATE">'+'                    <div class="dtp-actual-meridien">'+'                        <div class="left p20">'+'                            <a href="#" mdc-dtp-noclick class="dtp-meridien-am" ng-class="{selected: picker.meridien == \'AM\'}" ng-click="picker.selectAM()">AM</a>'+"                        </div>"+'                        <div ng-show="!picker.timeMode" class="dtp-actual-time p60">{{picker.currentNearest5Minute().format(picker.params.shortTime ? "hh:mm" : "HH:mm")}}</div>'+'                        <div class="right p20">'+'                            <a href="#" mdc-dtp-noclick class="dtp-meridien-pm" ng-class="{selected: picker.meridien == \'PM\'}" ng-click="picker.selectPM()">PM</a>'+"                        </div>"+'                        <div class="clearfix"></div>'+"                    </div>"+'                    <mdc-datetime-picker-clock mode="hours" ng-if="picker.currentView === picker.VIEWS.HOUR"></mdc-datetime-picker-clock>'+'                    <mdc-datetime-picker-clock mode="minutes" ng-if="picker.currentView === picker.VIEWS.MINUTE"></mdc-datetime-picker-clock>'+"                </div>"+"            </div>"+"        </div>"+"    </md-dialog-content>"+'    <md-dialog-actions class="dtp-buttons">'+'            <md-button class="dtp-btn-cancel md-button" ng-click="picker.cancel()"> {{picker.params.cancelText}}</md-button>'+'            <md-button class="dtp-btn-ok md-button" ng-click="picker.ok()"> {{picker.params.okText}}</md-button>'+"      </md-dialog-actions>"+"</md-dialog>";angular.module(t,["ngMaterial"]).directive("mdcDatetimePicker",["$mdDialog",function(t){return{restrict:"A",require:"ngModel",scope:{currentDate:"=ngModel",time:"=",date:"=",minDate:"=",maxDate:"=",shortTime:"=",format:"@",cancelText:"@",okText:"@"},link:function(a,r,s,c){var l=false;if(!a.format){if(a.date&&a.time){a.format="YYYY-MM-DD HH:mm:ss"}else if(a.date){a.format="YYYY-MM-DD"}else{a.format="HH:mm"}}if(angular.isString(a.currentDate)&&a.currentDate!==""){a.currentDate=e(a.currentDate,a.format)}if(c){c.$formatters.push(function(t){var r=e(t);return r.isValid()?r.format(a.format):""})}r.attr("readonly","");r.on("focus",function(e){e.preventDefault();r.blur();if(l){return}l=true;var c={};for(var o in s){if(a.hasOwnProperty(o)&&!angular.isUndefined(a[o])){c[o]=a[o]}}c.currentDate=a.currentDate;var d={options:c};t.show({template:i,controller:n,controllerAs:"picker",locals:d,openFrom:r,parent:angular.element(document.body),bindToController:true,disableParentScroll:false}).then(function(e){a.currentDate=e?e._d:e;l=false},function(){l=false})})}}}]);var n=function(e,t){this.currentView=a.DATE;this._dialog=t;this.minDate;this.maxDate;this._attachedEvents=[];this.VIEWS=a;this.params={date:true,time:true,format:"YYYY-MM-DD",minDate:null,maxDate:null,currentDate:null,lang:"en",weekStart:0,shortTime:false,cancelText:"Cancel",okText:"OK"};this.meridien="AM";this.params=angular.extend(this.params,this.options);this.init()};n.$inject=["$scope","$mdDialog"];n.prototype={init:function(){this.timeMode=this.params.time&&!this.params.date;this.dateMode=this.params.date;this.initDates();this.start()},currentNearest5Minute:function(){var t=this.currentDate||e();var a=5*Math.round(t.minute()/5);if(a>=60){a=55}return e(t).minutes(a)},initDates:function(){var t=this;var a=function(a,r){var i=null;if(angular.isDefined(a)&&a!==null&&a!==""){if(angular.isString(a)){if(typeof t.params.format!=="undefined"&&t.params.format!==null){i=e(a,t.params.format).locale(t.params.lang)}else{i=e(a).locale(t.params.lang)}}else{if(angular.isDate(a)){var n=a.getTime();i=e(n,"x").locale(t.params.lang)}else if(a._isAMomentObject){i=a}}}else{i=r}return i};this.currentDate=a(this.params.currentDate,e());this.minDate=a(this.params.minDate);this.maxDate=a(this.params.maxDate);this.selectDate(this.currentDate)},initDate:function(e){this.currentView=a.DATE},initHours:function(){this.currentView=a.HOUR},initMinutes:function(){this.currentView=a.MINUTE},isAfterMinDate:function(t,a,r){var i=true;if(typeof this.minDate!=="undefined"&&this.minDate!==null){var n=e(this.minDate);var s=e(t);if(!a&&!r){n.hour(0);n.minute(0);s.hour(0);s.minute(0)}n.second(0);s.second(0);n.millisecond(0);s.millisecond(0);if(!r){s.minute(0);n.minute(0);i=parseInt(s.format("X"))>=parseInt(n.format("X"))}else{i=parseInt(s.format("X"))>=parseInt(n.format("X"))}}return i},isBeforeMaxDate:function(t,a,r){var i=true;if(typeof this.maxDate!=="undefined"&&this.maxDate!==null){var n=e(this.maxDate);var s=e(t);if(!a&&!r){n.hour(0);n.minute(0);s.hour(0);s.minute(0)}n.second(0);s.second(0);n.millisecond(0);s.millisecond(0);if(!r){s.minute(0);n.minute(0);i=parseInt(s.format("X"))<=parseInt(n.format("X"))}else{i=parseInt(s.format("X"))<=parseInt(n.format("X"))}}return i},selectDate:function(t){if(t){this.currentDate=e(t);if(!this.isAfterMinDate(this.currentDate)){this.currentDate=e(this.minDate)}if(!this.isBeforeMaxDate(this.currentDate)){this.currentDate=e(this.maxDate)}this.currentDate.locale(this.params.lang);this.calendarStart=e(this.currentDate);this.meridien=this.currentDate.hour()>=12?"PM":"AM"}},setName:function(){var e="";var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(var a=0;a<5;a++){e+=t.charAt(Math.floor(Math.random()*t.length))}return e},isPM:function(){return this.meridien==="PM"},isPreviousMonthVisible:function(){return this.calendarStart&&this.isAfterMinDate(e(this.calendarStart).startOf("month"),false,false)},isNextMonthVisible:function(){return this.calendarStart&&this.isBeforeMaxDate(e(this.calendarStart).endOf("month"),false,false)},isPreviousYearVisible:function(){return this.calendarStart&&this.isAfterMinDate(e(this.calendarStart).startOf("year"),false,false)},isNextYearVisible:function(){return this.calendarStart&&this.isBeforeMaxDate(e(this.calendarStart).endOf("year"),false,false)},isHourAvailable:function(t){var a=e(this.currentDate);a.hour(this.convertHours(t)).minute(0).second(0);return this.isAfterMinDate(a,true,false)&&this.isBeforeMaxDate(a,true,false)},isMinuteAvailable:function(t){var a=e(this.currentDate);a.minute(t).second(0);return this.isAfterMinDate(a,true,true)&&this.isBeforeMaxDate(a,true,true)},start:function(){this.currentView=a.DATE;if(this.params.date){this.initDate()}else{if(this.params.time){this.initHours()}}},ok:function(){switch(this.currentView){case a.DATE:if(this.params.time===true){this.initHours()}else{this.hide(true)}break;case a.HOUR:this.initMinutes();break;case a.MINUTE:this.hide(true);break}},cancel:function(){if(this.params.time){switch(this.currentView){case a.DATE:this.hide();break;case a.HOUR:if(this.params.date){this.initDate()}else{this.hide()}break;case a.MINUTE:this.initHours();break}}else{this.hide()}},selectMonthBefore:function(){this.calendarStart.subtract(1,"months")},selectMonthAfter:function(){this.calendarStart.add(1,"months")},selectYearBefore:function(){this.calendarStart.subtract(1,"years")},selectYearAfter:function(){this.calendarStart.add(1,"years")},selectAM:function(){if(this.currentDate.hour()>=12){this.selectDate(this.currentDate.subtract(12,"hours"))}},selectPM:function(){if(this.currentDate.hour()<12){this.selectDate(this.currentDate.add(12,"hours"))}},convertHours:function(e){var t=e;if(e<12&&this.isPM())t+=12;return t},hide:function(e){if(e){this._dialog.hide(this.currentDate)}else{this._dialog.cancel()}}};angular.module(t).directive("mdcDatetimePickerCalendar",[function(){var t=e(),a=1900,r=2100,i=(r-a+1)*12,n=240,s=[];for(var c=0;c<i;c++){s.push(c)}var l=function(e){var t=e.year();var r=e.month();return(t-a)*12+r-1};return{restrict:"E",scope:{picker:"=",date:"="},bindToController:true,controllerAs:"cal",controller:["$scope",function(t){var r=this,n=this.picker,c=[];for(var o=n.params.weekStart;c.length<7;o++){if(o>6){o=0}c.push(o.toString())}r.week=c;if(!n.maxDate&&!n.minDate){r.months=s}else{var d=n.minDate?l(n.minDate):0;var u=n.maxDate?l(n.maxDate)+1:i;r.months=s.slice(d,u)}r.getItemAtIndex=function(t){var r=(t+1)%12||12;var i=a+Math.floor(t/12);var s=e(n.currentDate).year(i).month(r);return m(s)};r.topIndex=l(n.currentDate)-r.months[0];var m=function(t){var a={};if(t!==null){a.name=t.format("MMMM YYYY");var i=e(t).locale(n.params.lang).startOf("month").hour(t.hour()).minute(t.minute());var s=i.format("d");a.days=[];for(var c=i.date();c<=i.daysInMonth();c++){if(c===i.date()){var l=r.week.indexOf(s.toString());if(l>0){for(var o=0;o<l;o++){a.days.push(0)}}}a.days.push(e(i).locale(n.params.lang).date(c))}var d=7,u=[],m=Math.ceil(a.days.length/d);for(var p=0;p<m;p++){u.push(a.days.slice(p*d,(p+1)*d))}a.days=u;return a}};r.toDay=function(t){return e(parseInt(t),"d").locale(n.params.lang).format("dd").substring(0,1)};r.isInRange=function(t){return n.isAfterMinDate(e(t),false,false)&&n.isBeforeMaxDate(e(t),false,false)};r.selectDate=function(t){if(t){if(r.isSelectedDay(t)){return n.ok()}n.selectDate(e(t).hour(r.date.hour()).minute(r.date.minute()))}};r.isSelectedDay=function(e){return e&&r.date.date()===e.date()&&r.date.month()===e.month()&&r.date.year()===e.year()}}],template:'<md-virtual-repeat-container class="months">'+'<div md-virtual-repeat="idx in cal.months" md-start-index="cal.topIndex" md-item-size="'+n+'">'+'     <div mdc-datetime-picker-calendar-month idx="idx"></div>'+"</div>"+"</md-virtual-repeat-container>"}}]).directive("mdcDatetimePickerCalendarMonth",["$compile",function(e){var t=function(t,a){var r=angular.element(t[0].querySelector("tbody"));var i=a.cal,n=a.month;r.html("");n.days.forEach(function(e,t){var a=angular.element("<tr></tr>");e.forEach(function(e,r){var n=angular.element("<td> </td>");if(e){var s;if(i.isInRange(e)){var c='month["days"]['+t+"]["+r+"]";s=angular.element("<a href='#' mdc-dtp-noclick></a>").attr("ng-class","{selected: cal.isSelectedDay("+c+")}").attr("ng-click","cal.selectDate("+c+")")}else{s=angular.element("<span></span>")}s.addClass("dtp-select-day").html(e.format("D"));n.append(s)}a.append(n)});r.append(a)});e(r)(a)};return{scope:{idx:"="},require:"^mdcDatetimePickerCalendar",restrict:"AE",template:'<div class="dtp-picker-month">{{month.name}}</div>'+'<table class="table dtp-picker-days">'+"    <thead>"+"    <tr>"+'        <th ng-repeat="day in cal.week">{{cal.toDay(day)}}</th>'+"    </tr>"+"    </thead>"+"    <tbody>"+"    </tbody>"+"</table>",link:function(e,a,r,i){e.cal=i;e.month=i.getItemAtIndex(parseInt(e.idx));t(a,e);e.$watch(function(){return e.idx},function(r,n){if(r!=n){e.month=i.getItemAtIndex(parseInt(e.idx));t(a,e)}})}}}]);angular.module(t).directive("mdcDtpNoclick",function(){return{link:function(e,t){t.on("click",function(e){e.preventDefault()})}}});angular.module(t).directive("mdcDatetimePickerClock",[function(){var e='<div class="dtp-picker-clock"><span ng-if="!points || points.length < 1">&nbsp;</span>'+'<div ng-repeat="point in points" class="dtp-picker-time" style="margin-left: {{point.left}}px; margin-top: {{point.top}}px;">'+'   <a href="#" mdc-dtp-noclick ng-class="{selected: point.value===currentValue}" class="dtp-select-hour" ng-click="setTime(point.value)" ng-if="pointAvailable(point)">{{point.display}}</a>'+'   <a href="#" mdc-dtp-noclick class="disabled dtp-select-hour" ng-if="!pointAvailable(point)">{{point.display}}</a>'+"</div>"+'<div class="dtp-hand dtp-hour-hand"></div>'+'<div class="dtp-hand dtp-minute-hand"></div>'+'<div class="dtp-clock-center"></div>'+"</div>";return{restrict:"E",template:e,link:function(e,t,a){var i=a.mode==="minutes";var n=e.picker;var s=document.querySelector("md-dialog.dtp");var c=function(){var a=angular.element(t[0].querySelector(".dtp-picker-clock")),n=angular.element(s.querySelector(".dtp-picker"));var c=s.querySelector(".dtp-content").offsetWidth;var o=parseInt(r(n,"paddingLeft").replace("px",""))||0;var u=parseInt(r(n,"paddingRight").replace("px",""))||0;var m=parseInt(r(a,"marginLeft").replace("px",""))||0;var p=parseInt(r(a,"marginRight").replace("px",""))||0;var h=c-(m+p+o+u);a.css("width",h+"px");var f=parseInt(r(n,"paddingLeft").replace("px",""))||0;var v=parseInt(r(n,"paddingTop").replace("px",""))||0;var D=parseInt(r(a,"marginLeft").replace("px",""))||0;var g=parseInt(r(a,"marginTop").replace("px",""))||0;var k=h/2;var M=k/1.2;var x=[];for(var y=0;y<12;++y){var b=M*Math.sin(Math.PI*2*(y/12));var I=M*Math.cos(Math.PI*2*(y/12));var A={left:k+b+f/2-(f+D),top:k-I-g/2-(v+g),value:i?y*5:y};if(i){A.display=A.value<10?"0"+A.value:A.value}else{A.display=y===0?12:y}x.push(A)}e.points=x;d();a.css("height",h+"px");var S=t[0].querySelector(".dtp-clock-center");var w=S.offsetWidth/2||7.5,T=S.offsetHeight/2||7.5;var E=k/1.8;var H=k/1.5;angular.element(t[0].querySelector(".dtp-hour-hand")).css({left:k+D*1.5+"px",height:E+"px",marginTop:k-E-f+"px"}).addClass(!i?"on":"");angular.element(t[0].querySelector(".dtp-minute-hand")).css({left:k+D*1.5+"px",height:H+"px",marginTop:k-H-f+"px"}).addClass(i?"on":"");angular.element(S).css({left:k+f+D-w+"px",marginTop:k-D/2-T+"px"});l()};var l=function(){var e=n.currentNearest5Minute();var a=e.hour();var r=e.minute();o(angular.element(t[0].querySelector(".dtp-hour-hand")),360/12*a);var i=360/60*(5*Math.round(r/5));o(angular.element(t[0].querySelector(".dtp-minute-hand")),i)};var o=function(e,t){angular.element(e).css({WebkitTransform:"rotate("+t+"deg)","-moz-transform":"rotate("+t+"deg)"})};var d=function(){var t=n.currentNearest5Minute();e.currentValue=i?t.minute():t.hour()%12};e.$watch(function(){var e=n.currentNearest5Minute();return e?e.format("HH:mm"):""},function(e){d();l()});e.setTime=function(t){if(t===e.currentValue){n.ok()}if(!i){n.currentDate.hour(n.isPM()?t+12:t)}else{n.currentDate.minute(t)}n.currentDate.second(0)};e.pointAvailable=function(e){return i?n.isMinuteAvailable(e.value):n.isHourAvailable(e.value)};var u=e.$watch(function(){return t[0].querySelectorAll("div").length},function(){c();u()})}}}])})(moment);
//# sourceMappingURL=angular-material-datetimepicker.min.map