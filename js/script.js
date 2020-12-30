var View = {
    'get': function(k) {
        if (typeof this.preselectElements[k] === 'undefined') this.preselectElements[k] = $(k);
        return this.preselectElements[k];
    },
    'preselectElements': {},
    'cache': {},
    'styleIt': function() {
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();

        this.get('.whm50').css('height', (windowHeight - 50) + 'px');
        this.get('.ww').css('width', windowWidth + 'px');
        if (windowWidth > 800) {
            this.get('.s-mt100').css('margin-top', (windowHeight - 50) + 'px');
        } else {
            this.get('.s-mt100').css('margin-top', 0);
        }

        View.headerBackground.start();
    },
    'scrollIt': function() {
        var scrollTop = $(window).scrollTop();
        var windowHeight = $(window).height();
        var wh = $(window).height();
        var whmin50 = wh - 50;
        var boxes = View.get('.box');
        var minioverlays = View.get('.miniOverlay');

        if (this.isMobile()) {
        } else {
            //header
            if (scrollTop >= whmin50) {
                View.get('#menubar').addClass('s-fix');
            } else {
                View.get('#menubar').removeClass('s-fix');
            }

            boxes.each(function(k, v) {
                var box = $(v);
                var upper = scrollTop + (windowHeight / 4);
                var under = scrollTop + (windowHeight / 4 * 3);
                if (box.offset().top <= under && (box.offset().top + box.height()) >= upper) {
                    box.addClass('full');
                } else {
                    box.removeClass('full');
                }
            });

            minioverlays.each(function(k, v) {
                var minioverlay = $(v);
                var upper = scrollTop + windowHeight / 2;
                var under = scrollTop + windowHeight;
                if (minioverlay.offset().top <= under && minioverlay.offset().top >= upper) {
                    minioverlay.css('opacity', 1 - (under - minioverlay.offset().top) / (under - upper));
                }
            });

        }

        if (scrollTop < whmin50) {
            View.get('body').attr('class', '');
            View.get('header > section.centered').removeClass('hidden');
        } else if (scrollTop + wh < View.get('.fancyFountain').offset().top) {
            View.get('body').attr('class', 'greenApp');
            View.get('header > section.centered').addClass('hidden');
        } else if (scrollTop < View.get('.newYork').offset().top - windowHeight) {
            View.get('body').attr('class', 'blueFountain');
            View.get('header > section.centered').addClass('hidden');
            View.get('.impossibleAudioNY').html('');
        } else if (scrollTop < View.get('.newYork').offset().top + View.get('.newYork').height()) {
            View.get('body').attr('class', 'blueFountain');
            View.headerBackground.setType('circle');
            View.get('header > section.centered').addClass('hidden');
            if (View.get('.impossibleAudioNY').html().trim() === '') {
                View.get('.impossibleAudioNY').html(View.cache['audioNY']);
            }
        } else if (scrollTop < View.get('.flowers').offset().top + View.get('.flowers').height()) {
            View.get('body').attr('class', 'flowersMay');
            View.headerBackground.setType('flower');
            View.get('header > section.centered').addClass('hidden');
            View.get('.impossibleAudioNY').html('');
        } else if (scrollTop < View.get('.escape').offset().top - windowHeight) {
            View.get('body').attr('class', 'jennaBG');
            View.get('header > section.centered').addClass('hidden');
            View.get('.impossibleAudioSE').html('');
        } else if (scrollTop < View.get('.movember').offset().top - windowHeight) {
            View.get('body').attr('class', 'jennaBG');
            View.headerBackground.setType('flower');
            View.get('header > section.centered').addClass('hidden');
            if (View.get('.impossibleAudioSE').html().trim() === '') {
                View.get('.impossibleAudioSE').html(View.cache['audioSE']);
            }
        } else if (scrollTop < View.get('.movember').offset().top) {
            View.get('body').attr('class', 'snow');
            View.headerBackground.setType('star');
            View.get('header > section.centered').addClass('hidden');
        } else if (scrollTop < View.get('.movember').offset().top + windowHeight +  View.get('.movember').height()) {
            View.get('.impossibleAudioSE').html('');
            View.get('header > section.centered').addClass('hidden');
        }
    },
    'keyIt': function(e) {
        var scrollTop = $(window).scrollTop();
        var windowHeight = $(window).height();
        switch(e.keyCode)
        {
            case 38:
                (function onKeyUp() {
                    $('html, body').animate({
                        'scrollTop': scrollTop - windowHeight
                    }, 'fast');
                })();
                break;
            case 40:
                (function onKeyDown() {
                    $('html, body').animate({
                        'scrollTop': scrollTop + windowHeight
                    }, 'fast');
                })();
                break;
        }
    },
    'cacheIt': function() {
        var cb = function() {
            View.get('[data-href]').each(function(k, v) {
                if (typeof Model.FB_STATUSES[$(v).data('href')] !== 'undefined') {
                    $(v).html('<a href="' + $(v).data('href') + '" target="_blank"><img src="' + Model.FB_STATUSES[$(v).data('href')] + '" alt="facebook post"/></a>');
                }
            });
        };

        try {
            if (LocalStorage.load('FB_STATUSES') !== null) {
                Model.FB_STATUSES = LocalStorage.load('FB_STATUSES');
            }
        } catch (ex) {console.log('EXCEPTION', ex)}

        if (typeof Model.FB_STATUSES === 'undefined') {
            $.ajax('/2014/js/cachedstatuses.json').fail(function(d){
                if (d.responseText) {
                    eval('var data = ' + d.responseText + ';');
                    Model.FB_STATUSES = data;
                    try {
                        LocalStorage.save('FB_STATUSES', data);
                    } catch (ex) {console.log('EXCEPTION', ex)}
                    cb();
                }
            });
        }
        else {
            cb();
        }


    },
    'headerBackground': (function() {
        var _interval = null;
        var _element = null;
        var _context = null;
        var _circles = [];
        var _type = 'circle';

        return {
            'start': function() {
                _element = View.get('#headerBG');
                _element.attr('height', _element.height());
                _element.attr('width', _element.width());
                _context = _element[0].getContext('2d');

                _circles = [];
                View.CanvasTools.clear(_context, _element.height(), _element.width());
                if (_interval !== null) {
                    clearInterval(_interval);
                }

                for (var i = 0; i < 200; i++) {
                    var x = Math.random() * (_element.width() - 50) + 50;
                    var y = Math.random() * (_element.height() - 50) + 50;
                    var radius = Math.random() * 5 + 1;
                    var tint = 255;// parseInt(Math.random() * 255);
                    var color = 'rgba(' + tint + ',' + tint + ',' + tint + ',0.6)';
                    var direction = {
                        'x': (Math.round(Math.random()) > 0),
                        'y': (Math.round(Math.random()) > 0)
                    };
                    _circles.push({
                        'x': x, 'y': y, 'radius': radius, 'color': color, 'direction': direction
                    });
                }

                _interval = setInterval(function() {
                    var len = _circles.length;

                    View.CanvasTools.clear(_context, _element.height(), _element.width());

                    for (var i = 0; i < len; i++) {
                        var circle = _circles[i];
                        if (_type === 'circle' || View.isMobile()) {
                            View.CanvasTools.drawCircle(_context, circle);
                        } else if (_type === 'star') {
                            View.CanvasTools.drawStar(_context, circle);
                        } else if (_type === 'flower') {
                            View.CanvasTools.drawFlower(_context, circle);
                        }
                        circle.x = (circle.direction.x) ? circle.x + 1 : circle.x - 1;
                        circle.y = (circle.direction.y) ? circle.y + 1 : circle.y - 1;
                        if (circle.x <= 0) circle.direction.x = true;
                        if (circle.x >= _element.width()) circle.direction.x = false;
                        if (circle.y <= 0) circle.direction.y = true;
                        if (circle.y >= _element.height()) circle.direction.y = false;
                    }

                }, 50);
            },
            'getType': function() {
                return _type;
            },
            'setType': function(type) {
                if (_type !== type) {
                    _type = type;
                    this.stop();
                    this.start();
                }
            },
            'stop': function() {
                clearInterval(_interval);
            }
        }
    })(),
    'insertTWCPeople': function() {
        var html = '';
        for (var p in Model.TWCFriends)
        {
            var person = Model.TWCFriends[p];
            html += '<li style="background-image: url(\'' + person.picture + '\')"><span>' + person.name + '</span></li>';
        }
        View.get('#TWCPeople').html(html);
    },
    'CanvasTools': {
       'drawCircle': function(context, c) {
           context.beginPath();
           context.arc(c.x, c.y, c.radius, 0, 2 * Math.PI, false);
           context.fillStyle = c.color;
           context.fill();
           context.lineWidth = 0;
           //context.strokeStyle = '#003300';
           //context.stroke();
       },
       'drawStar': function(ctx, c) {
           var spikes = 6;
           var outerRadius = c.radius;
           var innerRadius = 0.5 * outerRadius;
           var rot = Math.PI/2*3;
           var x = c.x;
           var y = c.y;
           var step=Math.PI/spikes;

           ctx.fillStyle = c.color;
           ctx.lineWidth = 0;
           ctx.beginPath();
           ctx.moveTo(c.x, c.y - outerRadius);
           for(var i = 0; i < spikes; i++){
               x = c.x + Math.cos(rot) * outerRadius;
               y = c.y + Math.sin(rot) * outerRadius;
               ctx.lineTo(x,y);
               rot += step;

               x = c.x + Math.cos(rot) * innerRadius;
               y = c.y + Math.sin(rot) * innerRadius;
               ctx.lineTo(x,y);
               rot += step;
           }
           ctx.lineTo(c.x, c.y - outerRadius);
           ctx.fill();
           ctx.closePath();
       },
       'drawFlower': function(context, c) {
           var r = c.radius;
           var ground = {x: c.x, y: c.y};

           context.fillStyle = '#fff';
           context.lineWidth = 1;
           for (var i = 1; i < 17; i++) {
               var deg = 2 * Math.PI * i / 16;
               var x1 = ground.x + Math.cos(deg - Math.PI / 180 * r/4) * 3 * r/2;
               var y1 = ground.y + Math.sin(deg - Math.PI / 180 * r/4) * 3 * r/2;
               var x2 = ground.x + Math.cos(deg + Math.PI / 180 * r/4) * 3 * r/2;
               var y2 = ground.y + Math.sin(deg + Math.PI / 180 * r/4) * 3 * r/2;
               var rad = Math.sqrt(Math.abs(Math.pow(x2-x1,2)-Math.pow(y2-y1,2))) / 2;
               context.beginPath();
               context.lineWidth = 0;
               context.moveTo(ground.x,ground.y);
               context.lineTo(x1,y1);
               context.moveTo(ground.x,ground.y);
               context.lineTo(x2,y2);
               context.lineTo(x1,y1);
               context.moveTo(x2,y2);
               context.arc(ground.x + Math.cos(deg) * 3 * r/2, ground.y + Math.sin(deg) * 3 * r/2, rad, 0.5 * Math.PI + deg, deg + 1.5 * Math.PI, true);
               context.fill();
               context.closePath();
           }

       },
       'clear': function(context, h, w) {
           context.clearRect(0, 0, w, h);
       }
    },
    'isMobile': function() {
        return ($(window).width() < 800);
    }
};

var Model = {
    'TWCFriends': [
        new TWCFriend('616507740', 'Abraham'),
        new TWCFriend('733063562', 'Adélaïde'),
        new TWCFriend('588665132', 'Alex'),
        new TWCFriend('100003180906844', 'Alicia'),
        new TWCFriend('515676090', 'Ana Maria'),
        new TWCFriend('801027707', 'Andres'),
        new TWCFriend('506346358', 'Daniel'),
        new TWCFriend('599786233', 'Francisco'),
        new TWCFriend('100000146728344', 'Ginno'),
        new TWCFriend('500785479', 'Guillermo'),
        new TWCFriend('615926084', 'Haley'),
        new TWCFriend('569803834', 'Jenny'),
        new TWCFriend('539335499', 'Jose'),
        new TWCFriend('1124323782', 'Joshua'),
        new TWCFriend('100000228667147', 'Karissa'),
        new TWCFriend('1156993494', 'Kelsey'),
        new TWCFriend('508021611', 'Chelsea'),
        new TWCFriend('1301355506', 'Kristie'),
        new TWCFriend('728640236', 'Leslie'),
        new TWCFriend('1770990145', 'Lizbeth'),
        new TWCFriend('100002258871833', 'Marisol'),
        new TWCFriend('100000090367175', 'Michael'),
        new TWCFriend('1488837174', 'Natalie'),
        new TWCFriend('776282858', 'Nikki'),
        new TWCFriend('649948941', 'Paige'),
        new TWCFriend('787985541', 'Paola'),
        new TWCFriend('667168111', 'Patrick'),
        new TWCFriend('684648190', 'Pau'),
        new TWCFriend('1568453291', 'Pauline'),
        new TWCFriend('691379075', 'Romy'),
        new TWCFriend('1223060129', 'Roy'),
        new TWCFriend('100001253833203', 'Samantha'),
        new TWCFriend('1031627343', 'Sarah'),
        new TWCFriend('745456933', 'Sarah'),
        new TWCFriend('1030051249', 'Shari'),
        new TWCFriend('706370017', 'Simon'),
        new TWCFriend('1097337439', 'Suzanne'),
        new TWCFriend('597036220', 'Syed'),
        new TWCFriend('601753525', 'Tatiana'),
        new TWCFriend('1072475088', 'Thomas'),
        new TWCFriend('831790466', 'Vicky'),
        new TWCFriend('629275931', 'Viktor'),
        new TWCFriend('1102447341', 'Vikas'),
        new TWCFriend('600803347', 'Waba')
    ]
};

var LocalStorage = {
    browserSupports: function() {
        try {
            if(window.localStorage) {
                return window.localStorage;
            }
        } catch (e) {}
        return null;
    },
    load: function(key) {
        if(this.browserSupports()!=null) {
            eval('var d = ' + this.browserSupports().getItem(key));
            return d;
        }
        var cookieVal = getCookie();
        if(cookieVal!=null) {
            return eval(cookieVal);
        }
        return null;
        function getCookie() {
            var name = key + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++)
            {
                var c = ca[i].trim();
                if (c.indexOf(name)==0) return c.substring(name.length,c.length);
            }
            return null;
        }
    },
    save: function(key, val) {
        function setCookie() {
            var d = new Date();
            d.setTime(d.getTime()+(exdays*24*60*60*1000));
            var expires = "expires="+d.toGMTString();
            document.cookie = key + "=" + JSON.stringify(val) + "; " + expires;
        }
        if(this.browserSupports()!=null) {
            this.browserSupports().setItem(key, JSON.stringify(val));
        }
        else {
            setCookie();
        }
        return null;
    }
};

function TWCFriend(id, name){
    this.id = id;
    this.picture = 'http://graph.facebook.com/' + id + '/picture?type=large';
    this.name = name;
}
TWCFriend.prototype = {};

$(function() {
    View.styleIt();
    View.cacheIt();
    View.headerBackground.start();
    View.insertTWCPeople();
    View.get('body').on('keyup', View.keyIt);

    View.cache['audioNY'] = View.get('.impossibleAudioNY').html().replace('<!--','').replace('-->','');
    View.get('.impossibleAudioNY').html('');

    View.cache['audioSE'] = View.get('.impossibleAudioSE').html().replace('<!--','').replace('-->','');
    View.get('.impossibleAudioSE').html('');

    $(window).on('resize', function() {
        View.styleIt();
    });
    $('a').each(function(k, v) {
       if ($(v).attr('href').indexOf('#') === 0) {
           $(v).on('click', function(e) {
              e.preventDefault();
              try {
                  window.history.pushState(null, 'dejakob.com | 2014 >> ' + $(v).attr('href').replace('#',''), $(v).attr('href'));
              } catch (ex) {}
              $('html, body').animate({
                  'scrollTop': $($(v).attr('href')).offset().top - 70
              }, 'fast');
           });
       }
    });

    $(window).on('scroll', function() {
        View.scrollIt();
    });

    $('#cache').on('click', function() {
        $('iframe').each(function(k, v) {
            html2canvas($(v).contents().find('body'), {
            onrendered: function(canvas) {
                canvas.setAttribute('id', 'screenshot' + k);
                document.body.appendChild(canvas);
                var dataurl = $('#screenshot' + k)[0].toDataURL("image/jpeg");

                if ($('#screenshotResults').length === 0) {
                    $('body').append('<textarea id="screenshotResults"></textarea>');
                }

                var id = $(v).parents('[data-href]');
                if (id.length > 0)
                {
                    id = id.data('href');
                    $('#screenshotResults').append('\'' + id + '\': \'' + dataurl + '\',');
                }
            }});
        });
    });
});