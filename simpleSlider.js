/*
https://github.com/leiyonglin/simpleSlider/
*/

var simpleSlider = (function (window, document) {
    var vendor = 'webkit',
	    cssVendor = '-webkit-',
		transform = 'webkitTransform',
		transitionDuration = 'webkitTransitionDuration',
		hasTouch = 'ontouchstart' in window,
		resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize',
		startEvent = hasTouch ? 'touchstart' : 'mousedown',
		moveEvent = hasTouch ? 'touchmove' : 'mousemove',
		endEvent = hasTouch ? 'touchend' : 'mouseup',
		cancelEvent = hasTouch ? 'touchcancel' : 'mouseup',
		transitionEndEvent = 'webkitTransitionEnd',
		
		simpleSlider = function (el, options) {
			var i;
			this.pageIndex     = 0;
			this.wrapper       = typeof el == 'string' ? document.querySelector(el) : el;
			this.slider        = this.wrapper.children[0];
			this.masterPages   = this.slider.children;
			this.numberOfPages = this.masterPages.length;
			this.options = {};
			for (i in options) this.options[i] = options[i];
			
			this.options.activeClass = this.options.activeClass==false?'':(this.options.activeClass||this.masterPages[this.pageIndex].className);
			
			this.refreshSize();
			
			window.addEventListener(resizeEvent, this, false);
			this.wrapper.addEventListener(startEvent, this, false);
			this.wrapper.addEventListener(moveEvent, this, false);
			this.wrapper.addEventListener(endEvent, this, false);
			this.slider.addEventListener(transitionEndEvent, this, false);
			
		};
		
		simpleSlider.prototype = {
		    x: 0,

		    handleEvent: function (e) {
				switch (e.type) {
					case startEvent:
						this.__start(e);
						break;
					case moveEvent:
						this.__move(e);
						break;
					case cancelEvent:
					case endEvent:
						this.__end(e);
						break;
					case resizeEvent:
						this.__resize();
						break;
					case transitionEndEvent:
						if(this.options.onTransitionEnd){this.options.onTransitionEnd.call(this,e);}
						break;
				}
			},
			refreshSize: function () {
				this.offset = this.options.offset?this.options.offset:this.wrapper.clientWidth;
			},
			__pos: function (x) {
				this.x = x;
				this.slider.style[transform] = 'translate3d(' + x + 'px,0,0)';
			},
			__resize: function () {
			    if(this.options.onResizeEvent) this.options.onResizeEvent.call(this);
				this.refreshSize();
				this.slider.style[transitionDuration] = '0s';
				this.__pos(-this.pageIndex * this.offset);
			},
			__start: function (e) {
				//e.preventDefault();
				if (this.initiated) return;
				var point = hasTouch ? e.touches[0] : e;
				this.initiated = true;
				this.moved = false;
				this.startX = point.pageX;
				this.startY = point.pageY;
				this.pointX = point.pageX;
				this.pointY = point.pageY;
				this.stepsX = 0;
				this.stepsY = 0;
				this.directionX = 0;
				this.directionLocked = false;
				this.slider.style[transitionDuration] = '0s';
			},
			__move: function (e) {
				if (!this.initiated) return;

				var point = hasTouch ? e.touches[0] : e,
					deltaX = point.pageX - this.pointX,
					deltaY = point.pageY - this.pointY,
					newX = this.x + deltaX,
					dist = Math.abs(point.pageX - this.startX);

				this.moved = true;
				this.pointX = point.pageX;
				this.pointY = point.pageY;
				this.directionX = deltaX > 0 ? 1 : deltaX < 0 ? -1 : 0;
				this.stepsX += Math.abs(deltaX);
				this.stepsY += Math.abs(deltaY);
				
				if (this.stepsX < 10 && this.stepsY < 10) return;
				if (!this.directionLocked && this.stepsY > this.stepsX) {
					this.initiated = false;
					return;
				}

				e.preventDefault();
				this.directionLocked = true;
				this.__pos(newX);
			},
			__end: function (e) {
				if (!this.initiated) return;
				var point = hasTouch ? e.changedTouches[0] : e,
					dist = Math.abs(point.pageX - this.startX);
				this.initiated = false;
				if (!this.moved) return;
				this.__checkPosition();
				if(this.options.onMoveEnd){this.options.onMoveEnd.call(this,e);}
			},
			__checkPosition: function () {
			    var activeClass = this.options.activeClass;
				
			    activeClass==''||(this.masterPages[this.pageIndex].className = this.masterPages[this.pageIndex].className.replace(activeClass, ''));
				if (this.directionX > 0) {
					if(this.pageIndex>0) this.pageIndex--;
				} else {
					if(this.pageIndex<(this.numberOfPages-1)) this.pageIndex++;
				}
				activeClass==''||(this.masterPages[this.pageIndex].className = (this.masterPages[this.pageIndex].className.trim()+' '+activeClass).trim());
				newX = -this.pageIndex * this.offset;
				this.slider.style[transitionDuration] = Math.floor(500 * Math.abs(this.x - newX) / this.offset) + 'ms';
                this.__pos(newX);
			}
		}
		
return simpleSlider;
})(window, document);