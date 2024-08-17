/*
* 一些自定义的其他 JS 函数
**/

// 随机跳转到博客中的一篇文章
function randomPost() {
    fetch('/sitemap.xml')
        .then(res => res.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            let ls = data.querySelectorAll('url loc');
            while (true) {
                let url = ls[Math.floor(Math.random() * ls.length)].innerHTML;
                // 去掉末尾的 .html
                url = url.replace(/\index.html$/, '');
                // 确保 URL 包含 /posts/ 路径
                if (url.includes('/posts/') && location.href !== url) {
                    location.href = url;
                    return;
                }
            }
        });
}

// 顶部导航栏的显示与隐藏
document.addEventListener('pjax:complete', tonav);
document.addEventListener('DOMContentLoaded', tonav);
//响应pjax
function tonav() {
    var nameContainer = document.querySelector("#nav #name-container");
    var menusItems = document.querySelector("#nav .menus_items");
    var position = $(window).scrollTop();

    $(window).scroll(function () {
        var scroll = $(window).scrollTop();

        if (scroll > position + 5) {
            nameContainer.classList.add("visible");
            menusItems.classList.remove("visible");
        } else if (scroll < position - 5) {
            nameContainer.classList.remove("visible");
            menusItems.classList.add("visible");
        }

        position = scroll;
    });

    // 初始化 page-name
    document.getElementById("page-name").innerText = document.title.split(" | LiuShen's Blog")[0];
}

// 切换表格的显示模式，夜间和白天模式
function switchPostChart() {
    let color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4C4948' : 'rgba(255,255,255,0.7)'
    if (document.getElementById('posts-chart') && postsOption) {
        try {
            let postsOptionNew = postsOption
            postsOptionNew.title.textStyle.color = color
            postsOptionNew.xAxis.nameTextStyle.color = color
            postsOptionNew.yAxis.nameTextStyle.color = color
            postsOptionNew.xAxis.axisLabel.color = color
            postsOptionNew.yAxis.axisLabel.color = color
            postsOptionNew.xAxis.axisLine.lineStyle.color = color
            postsOptionNew.yAxis.axisLine.lineStyle.color = color
            postsOptionNew.series[0].markLine.data[0].label.color = color
            postsChart.setOption(postsOptionNew)
        } catch (error) {
            console.log(error)
        }
    }
    if (document.getElementById('tags-chart') && tagsOption) {
        try {
            let tagsOptionNew = tagsOption
            tagsOptionNew.title.textStyle.color = color
            tagsOptionNew.xAxis.nameTextStyle.color = color
            tagsOptionNew.yAxis.nameTextStyle.color = color
            tagsOptionNew.xAxis.axisLabel.color = color
            tagsOptionNew.yAxis.axisLabel.color = color
            tagsOptionNew.xAxis.axisLine.lineStyle.color = color
            tagsOptionNew.yAxis.axisLine.lineStyle.color = color
            tagsOptionNew.series[0].markLine.data[0].label.color = color
            tagsChart.setOption(tagsOptionNew)
        } catch (error) {
            console.log(error)
        }
    }
    if (document.getElementById('categories-chart') && categoriesOption) {
        try {
            let categoriesOptionNew = categoriesOption
            categoriesOptionNew.title.textStyle.color = color
            categoriesOptionNew.legend.textStyle.color = color
            if (!categoryParentFlag) { categoriesOptionNew.series[0].label.color = color }
            categoriesChart.setOption(categoriesOptionNew)
        } catch (error) {
            console.log(error)
        }
    }
}

// 切换夜间模式和白天模式
function switchNightMode() {
    document.querySelector('body').insertAdjacentHTML('beforeend', '<div class="Cuteen_DarkSky"><div class="Cuteen_DarkPlanet"></div></div>'),
        setTimeout(function () {
            document.querySelector('body').classList.contains('DarkMode') ? (document.querySelector('body').classList.remove('DarkMode'), localStorage.setItem('isDark', '0'), document.getElementById('modeicon').setAttribute('xlink:href', '#icon-moon')) : (document.querySelector('body').classList.add('DarkMode'), localStorage.setItem('isDark', '1'), document.getElementById('modeicon').setAttribute('xlink:href', '#icon-sun')),
                setTimeout(function () {
                    document.getElementsByClassName('Cuteen_DarkSky')[0].style.transition = 'opacity 3s';
                    document.getElementsByClassName('Cuteen_DarkSky')[0].style.opacity = '0';
                    setTimeout(function () {
                        document.getElementsByClassName('Cuteen_DarkSky')[0].remove();
                    }, 1e3);
                }, 2e3)
        })
    const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    if (nowMode === 'light') {
        btf.activateDarkMode()
        btf.saveToLocal.set('theme', 'dark', 2)
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)
        document.getElementById('modeicon').setAttribute('xlink:href', '#icon-sun')
    } else {
        btf.activateLightMode()
        btf.saveToLocal.set('theme', 'light', 2)
        document.querySelector('body').classList.add('DarkMode'), document.getElementById('modeicon').setAttribute('xlink:href', '#icon-moon')
    }
    // handle some cases
    typeof utterancesTheme === 'function' && utterancesTheme()
    typeof FB === 'object' && window.loadFBComment()
    window.DISQUS && document.getElementById('disqus_thread').children.length && setTimeout(() => window.disqusReset(), 200)
    switchPostChart()
}

// 切换全屏状态的函数
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((error) => {
            console.error(`Error attempting to enable full-screen mode: ${error.message} (${error.name})`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch((error) => {
                console.error(`Error attempting to exit full-screen mode: ${error.message} (${error.name})`);
            });
        }
    }
}

// 小猫的显示和隐藏
function toggleLive2dVisibility() {
    const live2dContainer = document.getElementById('live2d-widget');
    if (live2dContainer.style.display === 'block' || live2dContainer.style.display === '') {
        live2dContainer.style.display = 'none'; // 显示Live2D模型
    } else {
        live2dContainer.style.display = 'block'; // 隐藏Live2D模型
    }
}

//动态标题
var OriginTitile = document.title;
var titleTime;
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        //离开当前页面时标签显示内容
        document.title = '👀跑哪里去了~';
        clearTimeout(titleTime);
    } else {
        //返回当前页面时标签显示内容
        document.title = '🐖抓到你啦～';
        //两秒后变回正常标题
        titleTime = setTimeout(function () {
            document.title = OriginTitile;
        }, 2000);
    }
});

// 侧栏时间
var _time10 = Array.from(Array(10)).map((n, i) => i);
var _time6 = _time10.slice(0, 6);
var _time3 = _time10.slice(0, 3);
var _Structure = [
    [_time3, _time10],
    [_time6, _time10],
    [_time6, _time10]
];
var clock = document.createElement('div');
clock.id = 'clock';
document.getElementById("digit-clock").appendChild(clock);
var digitGroups = [];
requestAnimationFrame(update);
_Structure.forEach(digits => {
    var digitGroup = document.createElement('div');
    digitGroup.classList.add('digit-group');
    clock.appendChild(digitGroup);
    digitGroups.push(digitGroup);
    digits.forEach(digitList => {
        var digit = document.createElement('div');
        digit.classList.add('digit');
        digitList.forEach(n => {
            var ele = document.createElement('div');
            ele.classList.add('digit-number');
            ele.innerText = n;
            digit.appendChild(ele);
        });
        digitGroup.appendChild(digit);
    });
});
function update() {
    requestAnimationFrame(update);
    var date = new Date();
    var time = [date.getHours(), date.getMinutes(), date.getSeconds()].
        map(n => `0${n}`.slice(-2).split('').map(e => +e)).
        reduce((p, n) => p.concat(n), []);
    time.forEach((n, i) => {
        var digit = digitGroups[Math.floor(i * 0.5)].children[i % 2].children;
        Array.from(digit).forEach((e, i2) => e.classList[i2 === n ? 'add' : 'remove']('bright'));
    });
}