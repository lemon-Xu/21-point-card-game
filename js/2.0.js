var addOn; // addOn 外挂 false 无 "看牌",可以看到下一张牌 "绝杀",得到一张最合适得牌
var numProbability; //电脑爆牌概率

var cardArea; // cardArea 抽卡区
var computerCard; // computerCard 电脑牌区
var playerCard = new Array(); // playerCard 玩家牌区
var playerNum; // 玩家得点数
var computerNum; // 电脑点数
var MAX = 5; // 最大牌数MAX为5
var MAXNUM = 21;
var goldWager = 10; // 赌注

var oldCard;

var computerGold = 1000; // computerGold 电脑金币
var playerGold = 100; // playGold 玩家金币

var winGN; // winGN 胜利局数
var failGN; // failGN 失败局数

function initializeGame() { // 游戏数据初始化
	addOn = "false";
	numProbability = 0;

	cardArea; // cardArea 抽卡区
	cardArea = addCardArray();
	computerCard = new Array();
	playerCard = new Array();
	playerNum = 0;
	computerNum = 0;
	goldWager = 10;
	computerGold -= goldWager;
	playerGold -= goldWager;

	if(playerGold <= 10)
		playerGold = 100;

	playMusic(MGold);
	document.getElementById("computerNum").innerHTML = "电脑：?";
	document.getElementById("playerNum").innerHTML = "玩家:0";
	document.getElementById("goldWager").innerHTML = "赌注:" + goldWager;
	document.getElementById("playerGold").innerHTML = playerGold;
	document.getElementById("computerGold").innerHTML = computerGold;

	function addCardArray() {
		var num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
		var type = ["方块", "梅花", "红桃", "黑桃"];
		var typeNum = [];

		for(a = 0; a < type.length; ++a) {
			for(b = 0; b < num.length; b++) {
				typeNum.push(type[a] + num[b]);
			}
		}
		return typeNum;
	}
}

// JQ函数入口，HTML DOM加载完毕后执行
$(document).ready(function() {
	$("#theOtherBugArea").fadeOut(); // 隐藏选任意牌界面
	$("#giveUp").click(function(){
		$("#theOtherBugArea").fadeOut(); // 隐藏选任意牌界面
	});
	$("#bgmMute").click(function() {
		// BGM静音
		var BGM = document.getElementById("BGM");
		if(BGM.paused)
			BGM.play();
		else
			BGM.pause();
	});

	$(".thebiggest").fadeToggle();
	// 介绍框确认按钮绑定，点击后介绍框隐藏，3秒后牌组框显现（1000毫秒是一秒）
	$("#OK").click(function() {
		$(".introduce").fadeToggle("");
		$(".thebiggest").fadeToggle(3000);
		// 对游戏初始化
		initializeGame();
	});

	// 看下张牌功能
	var lookClickNum = 0;
	var oldCard;
	var oldArrayIndex;
	$("#bugArea").fadeToggle(); // 作弊弹框
	var isChoose = false; // 是否要牌
	$(".choose").click(function() { // 看下张牌功能
		if(this.innerHTML == "要") {
			addOldCard();
		}
		$("#bugArea").fadeOut();
	});
	$("#look").click(function() {
		if(lookClickNum == 3) {
			getOldCard();
		} else if(lookClickNum > 3 && lookClickNum % 3 == 0) {
			alert("您的外挂余额不足，请及时充值");
		}
		lookClickNum++;

	});

	function getOldCard() {
		// 存储纸牌信息
		var who; // 当前要牌者  游戏流程控制 
		var playerNumDom = document.getElementById("playerNum");
		var arrayIndex = Math.floor(Math.random() * cardArea.length);
		var card = cardArea[arrayIndex];
		var num = getCardNum(card);
		var nextCardAreaDOM = document.getElementById("nextCardArea");
		nextCardAreaDOM.innerHTML = "<img src='img/" + card + ".jpg' />";
		$("#bugArea").fadeIn();
		oldCard = card;
		oldArrayIndex = arrayIndex;
	}

	function addOldCard() {
		var card = oldCard;
		//card = "方块13";
		var arrayIndex = oldArrayIndex;
		var num = getCardNum(card);
		num = popCard(playerCard, card, arrayIndex, num); // 从卡组中取出卡牌
		num = parseInt(num);
		console.log(playerCard);
		//alert("card:" + card + " arrayIndex:" + arrayIndex + " num" + num);
		if(num > 10)
			num = 0.5;
		playerNum += num; // 玩家点数更新
		changeCard("player", card, true);
		playMusic(MCard);
		addOn = "false";
		console.log("玩家觉得OK，要了牌");
		document.getElementById("playerNum").innerHTML = "玩家点数:" + playerNum;
		computerOperation();
	}

	// 看电脑牌并要任意牌
	var holderEvent = 0;
	$(".holder").click(function() { // 如果点击为4次触发要任意牌事件
		if(holderEvent == 3) { // 要任意牌事件
			if(computerNum >= 21) {
				settlement();
				return;
			}
			$("#theOtherBugArea").fadeIn();
			// 把电脑手牌显示出来
			for(i = 0; i < computerCard.length; ++i) {
				changeCard("holder", computerCard[i], true);
			}

			// 加载可以要牌的按钮
			var chooseAreaDOM = document.getElementById("chooseArea"); // 需要添加选牌按钮的DOM节点
			var childArray = new Array(); // 添加的孩子集合
			for(i = 0; i < cardArea.length; ++i) {
				var buttonDOM = document.createElement("button"); // 生成需要添加的button节点
				buttonDOM.innerHTML = cardArea[i]; // 添加卡牌信息
				buttonDOM.className = "HolderCard1"; // 添加后台需要的class信息
				chooseAreaDOM.appendChild(buttonDOM); // 把节点添加到显示区域
			}

			// 为节点添加点击事件
			$(".HolderCard1").click(function() {
				$("#theOtherBugArea").fadeOut(); // 隐藏界面
				var arrayIndex = -1;
				var cardHTML = this.innerHTML;
				//alert(cardHTML);
				for(i = 0; i < cardArea.length; ++i) {
					if(cardArea[i] = cardHTML) {
						changeCard("player", cardHTML, true);
						cardArea.splice(i, 1);
						playerCard.splice(playerCard.length, 0, cardHTML);
						break;
					}
				}
				var num = parseInt(getCardNum(cardHTML));
				if(num > 10)
					num = 0.5;
				playerNum += num;
				document.getElementById("playerNum").innerHTML = "玩家点数:" + playerNum;
				computerOperation();
			});

		} else if(holderEvent > 3 && holderEvent % 3 == 0) {
			alert("余额不足请，请及时充值");
		}
		holderEvent++;
	});

	$("#getCard").click(function() {
		if(!isChoose) {
			startGame();
		}
	});
	// 手牌为0提示
	$("#noCard").click(function() {
		if(playerCard.length == 0) {
			$("#ifNotChoose").fadeToggle();
		} else {
			settlement();
		}
	});
	$("#yes").click(function() {
		$("#ifNotChoose").fadeToggle()
	});

	// 加赌注弹框
	$("#addWager").click(function() {
		document.getElementById("nowWager").innerHTML = goldWager;
		document.getElementById("yourGold").innerHTML = playerGold;
		$("#addWagerArea").fadeToggle();
	});
	$("#sent").click(function() {
		addWager();
	}); // 加赌注操作

	// 绑定继续和结束按钮
	$(".GoOn").click(function() {
		goOn();
	});
	$(".noPlay").click(function() {});
});

/* 发牌事件绑定,玩家要牌后，判定超过21点
 * true，电脑自动判定是否要牌，然后游戏继续
 * false,玩家自爆，游戏结束
 */
function startGame(isChoose) {
	var card; // 存储纸牌信息
	var who; // 当前要牌者  游戏流程控制 
	var playerNumDom = document.getElementById("playerNum");

	// 玩家逻辑
	console.log("玩家操作:");
	if(playerCard.length != MAX) { // 玩家手牌没有达到上限
		var arrayIndex = Math.floor(Math.random() * cardArea.length);
		var card = cardArea[arrayIndex];
		var num = getCardNum(card);
		who = "player";
		//console.log(num);
		// 玩家流程
		if(addOn == "false") { // 无addOn模式
			num = popCard(playerCard, card, arrayIndex, num); // 从卡组中取出卡牌
			playerNum += addNum(num); // 玩家点数更新
			changeCard("player", card, true);
			playMusic(MCard);
		} else if(addOn == "绝杀") { // 绝杀模式
			card = checkCard(playerNum, "player");
			if(card == -1) {
				console.log("不要牌");
			} else {
				num = getCardNum(card);
				//console.log("card is" + card);
				num = popCard(playerCard, card, arrayIndex, num);
				//console.log("num is" + num);
				playerNum += addNum(num);
				changeCard("player", card, true);
				playMusic(MCard);
			}
		}
		playerNumDom.innerHTML = "玩家:" + playerNum;

		// 打印玩家信息
		console.log("playerCard is" + playerCard);
		console.log("playerNum is" + playerNum);
		console.log("-------------------------");
	}

	// 结算预判断
	if(playerCard.length == MAX || computerCard.length == MAX || playerNum > MAXNUM || computerNum > MAXNUM) {
		settlement();
	} else {
		computerOperation(); // 电脑操作
	}
	if(playerCard.length == MAX || computerCard.length == MAX || playerNum > MAXNUM || computerNum > MAXNUM) {
		settlement();
	}

};

/*
 * 利用循环给cardArea添加所用的纸牌元素
 */
function addCardArray() {
	var num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
	var type = ["方块", "梅花", "红桃", "黑桃"];
	var typeNum = [];

	for(a = 0; a < type.length; ++a) {
		for(b = 0; b < num.length; b++) {
			typeNum.push(type[a] + num[b]);
		}
	}
	return typeNum;
}

/* 抽牌函数，值为数组中任意一个，不会重复
 *
 * array.splice(index,delectcardArea,add1,add2) 用于删除（添加元素）
 * 	必选   index：需要操作的下标  delectcardArea 删除几个元素 
 * 	可选 add1 add2 要添加的元素
 * 
 * 因为数组下标比数组长度长度小1，所以才用向下取整，直接获得对应下标
 */

/* 提取纸牌点数
 * 利用正则表达式提取点数，返回给调用者
 */
function getCardNum(card) {
	var getNum = /\d{1,2}/;
	return card.match(getNum);
}

// 将抽到的牌添加到指定牌区   type:true 不是卡背,false是卡背      
function changeCard(who, card, type) {
	var img = document.createElement("img");
	if(type)
		img.src = "img/" + card + ".jpg";
	else
		img.src = "img/背面.jpg";
	img.className = "fadeIn";
	var html = document.createElement("td"); // 生成需要添加的节点
	html.appendChild(img);
	var addDom = who + "CArea";
	console.log("试图添加抽到的" + "img/" + card + ".jpg" + "加到" + addDom);
	addDom = document.getElementById(addDom);
	addDom.appendChild(html);

}

// 牌面翻转函数
function cardTurn() {
	var computerCArea = document.getElementById("computerCArea");
	computerCArea.className = "turnCard";
}

function settlement() { // 游戏结束逻辑
	if(goldWager != 0) {
		var gameState;
		console.log("对局结算:");
		// 牌面翻转
		playMusic(TCard);
		document.getElementById("computerNum").innerHTML = "电脑:" + computerNum;
		setTimeout("cardTurn()", 100);

		var backCards = document.getElementById("computerCArea");
		var childs = backCards.childNodes;
		//console.log(childs);
		for(i = 0; childs.length > 0;)
			backCards.removeChild(childs[i]);
		for(i = 0; i < computerCard.length; ++i)
			changeCard("computer", computerCard[i], true);

		// what 代表玩家胜利
		var what;

		if(playerNum > MAXNUM) {
			what = false;
			playMusic(fail);
			//console.log(fail);
		} else if(computerNum > MAXNUM) {
			what = true;
			playMusic(win);
			//console.log(win);
		} else if(playerNum > computerNum) {
			what = true;
			playMusic(win);
			//console.log(win);
		} else {
			what = false;
			playMusic(fail);
			//console.log(fail);
		}

		if(what == true) { // 玩家赢了
			$("#youWin").fadeToggle(4000);
			playerGold += 2 * parseInt(goldWager);
			document.getElementById("playerGold").innerHTML = playerGold;
			goldWager = 0;
		} else { // 玩家输了
			$("#youLost").fadeToggle(4000);
			computerGold += 2 * parseInt(goldWager);
			document.getElementById("computerGold").innerHTML = computerGold;
			goldWager = 0;
		}
		playMusic(MGold);
		//alert("结算了");
		//alert("玩家点数:"+playerNum+"  电脑点数"+computerNum);
	}
}

/* 游戏是否继续
 *  Y: 重置 cardArea  .thebiggest卡牌区域  游戏难度 addOn
 *  N: 保存数据   金币数量  战绩
 */
function goOn() {
	$("#youWin").fadeOut();
	$("#youLost").fadeOut();
	// 牌区清空
	document.getElementById("computerCArea").innerHTML = " ";
	document.getElementById("playerCArea").innerHTML = " ";

	// 数据初始化
	initializeGame();

	// 对牌堆初始化
	cardArea = addCardArray();
	console.log(cardArea);
}
// 电脑逻辑
function computerOperation() {
	if(playerCard.length == MAX || computerCard.length == MAX || playerNum > MAXNUM || computerNum > MAXNUM) {
		settlement();
		return;
	}
	if(computerCard.length != MAX) { // 电脑手牌没有达到上限
		arrayIndex = Math.floor(Math.random() * cardArea.length);
		card = cardArea[arrayIndex];
		num = getCardNum(card);
		who = "computer";
		//console.log(num);
		// 电脑流程
		console.log("电脑操作:");
		if(computerCard.length < 4) { // 非正常难度
			numProbability = computeNumProbility(computerNum); // 爆牌概率
			if(numProbability) {
				num = popCard(computerCard, card, arrayIndex, num); // 从卡组中取出卡牌
				computerNum += addNum(num); // 电脑点数更新
				changeCard("computer", card, false);
				playMusic(MCard);
				addWagerC();
			} else {
				console.log("电脑觉得很有可能爆牌，它不要牌了");
			}
		} else if(computerCard.length == 4) { // 炼狱难度
			card = checkCard(computerNum, "computer");
			if(card == -1) {
				console.log("不要牌");
			} else {
				num = getCardNum(card);
				//console.log("card is" + card);
				num = popCard(computerCard, card, arrayIndex, num);
				//console.log("num is" + num);
				computerNum += addNum(num);
				changeCard("computer", card, false);
				playMusic(MCard);
				addWagerC();
			}
		}

		// 打印电脑信息
		console.log("computerCard is" + computerCard);
		console.log("computerNum is" + computerNum);
		console.log("-------------------------");
	}
}

// 取出卡牌
function popCard(Array, card, arrayIndex, num) {
	Array.splice(Array.length, 0, card);
	cardArea.splice(arrayIndex, 1);
	return parseInt(num);
}

// 智能找牌  找到卡牌返回card，没有找到返回-1
function checkCard(whonum, who) {
	var type = ["方块", "梅花", "红桃", "黑桃"];
	var lackCard = MAXNUM - whonum;
	if(lackCard > 10) lackCard = 10;
	if(lackCard % 1 != 0) { // 当需要得点数存在半点时
		if(lackCard < 1) // 需要半点
			lackCard = 10 + Math.floor(Math.random() * 4);
		else // 一次达不到MAXNUM点，所以将点数最大化
			lackCard -= 0.5;
	}

	console.log(who + "需要得牌是:" + lackCard + ",智能找牌中...");
	var random = type.length - 1;
	while(true) {
		var Card = type[random] + lackCard; // 要查找的信息
		var index = cardArea.indexOf(Card);
		if(index != -1) { // 没有找到换个花色
			console.log("找到了需要得牌:" + Card + "它在牌组第" + index + "个");
			console.log(cardArea[index]);
			return cardArea[index];
			break;
		}
		random--;
		if(random == 0) { // 都没有找到退出
			console.log("智能找牌:牌不不存在,退出智能找牌");
			return -1;
		}
	}
}

// 计算卡牌点数 大于10点为0.5点
function addNum(num) {
	if(num > 10) num = 0.5;
	return num;
}

// 计算爆牌概率
function computeNumProbility(whonum) {
	var num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
	var maxNum = MAXNUM - whonum; // 最大的数
	var count = 0; // 不会爆牌的概率
	for(i = 0; i < num.length; ++i) {
		if(num[i] > 10)
			num[i] = 0.5;
	} // 大于10的点数为半点
	for(i = 0; i < num.length; ++i) {
		if(num[i] > maxNum)
			numProbability++;
		else
			count++;
	} // 大于maxNumd的次数
	numProbability /= num.length; // 可能爆牌的概率
	count /= num.length; // 不会爆牌的概率
	console.log("电脑爆牌概率:" + numProbability + " 电脑不会爆牌的概率" + count);
	if(numProbability > count) // 爆牌几率大,则不抽牌  
		return false;
	else
		return true;
}

// 音效播放
function playMusic(which) {
	var dom = document.getElementById(which);
	which.play();
}

// 玩家加注
function addWager() {
	console.log("加注操作");
	var wager = document.getElementById("numArea").value;
	var isNum = /\d+/;
	isNum = wager.match(isNum);
	if(isNum) {
		console.log("输入有效,加注金额:" + wager);
		if(wager <= playerGold && wager >= 0) {
			playerGold -= parseInt(wager);
			computerGold -= parseInt(wager);
			goldWager += parseInt(wager);
			console.log("操作成功，赌注更新为:" + goldWager);
			playMusic(MGold);
			document.getElementById("goldWager").innerHTML = "赌注:" + goldWager;
			document.getElementById("playerGold").innerHTML = playerGold;
			document.getElementById("computerGold").innerHTML = computerGold;
			$("#addWagerArea").fadeToggle();
		} else if(wager > playerGold) {
			alert("加注失败金币不够,当前金币:" + playerGold);
			console.log("加注失败金币不够,当前金币:" + playerGold);
		}
	} else
		alert("输入不合法,请输入整数");
	console.log("-------------------------------");
}

// 电脑加注
function addWagerC() {
	console.log("加注操作:")
	var winEvent = 0; // 电脑接近MAXNUM的概率
	var wagerMax = parseInt(0.2 * playerGold); // 最大赌注比
	winEvent = computerNum / MAXNUM;
	if(winEvent > 0.7) { // 加注
		var wager = parseInt(Math.random() * wagerMax);
		playerGold -= wager;
		goldWager += wager;
		computerGold -= wager;
		playMusic(MGold);
		document.getElementById("computerGold").innerHTML = computerGold;
		document.getElementById("playerGold").innerHTML = playerGold;
		document.getElementById("goldWager").innerHTML = "赌注:" + goldWager;
		console.log("电脑觉得他要赢了(" + winEvent + ")，正在把赌注" + wager + "加至" + goldWager);
	} else {
		console.log("电脑觉得不妙(" + winEvent + ")，没有加注")
	}
}