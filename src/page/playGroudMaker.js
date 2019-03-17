class PlaygroudMaker {
    createBricks(num = 10, totalBombRate = 0.1) {
        const brick = {
            bombNum: 0, // 周围雷的数量，-1表示自己是雷，0-8表示自己不是雷
            tagged: false, // 右键标记
            protection: true // 点击方块后保护层消失
        }
        const bricksArr = new Array(num * num)
        const bricksPure = JSON.parse(JSON.stringify(bricksArr.fill(brick)))
        const totalBomb = parseInt(totalBombRate*num*num)
        // this.set_remainingBombs(totalBomb)
        const bricksWithBombs = this.buryBomb(bricksPure, totalBomb)
        return {
            bricks: this.setSurroundBombNum(bricksWithBombs),
            totalBomb
        }
    }
    buryBomb(bricksPure, totalBomb) {
        const bricks = Object.assign(bricksPure)
        while (totalBomb) {
            const randomNum = Math.floor(Math.random()*bricks.length)
            if (bricks[randomNum].bombNum !== -1) {          
                bricks[randomNum].bombNum = -1
                totalBomb--
            }
        }
        return bricks
    }
    setSurroundBombNum(bricksWithBombs) {
        const bricksWithBombsLocal = Object.assign(bricksWithBombs)
        let sorroundIndexArr = [];
        let row = Math.sqrt(bricksWithBombsLocal.length);
        for(var i = bricksWithBombsLocal.length; i > 0; i--) {
            sorroundIndexArr = [i - row - 1, i - row, i - row + 1, i - 1, i + 1, i + row - 1, i + row, i + row + 1];
            // 边界检测
            if((i-1) % row == 0) {
                sorroundIndexArr.splice(0, 1);
                sorroundIndexArr.splice(2, 1);
                sorroundIndexArr.splice(3, 1);
            }
            if((i-1) % row == row-1) {
                sorroundIndexArr.splice(2, 1);
                sorroundIndexArr.splice(3, 1);
                sorroundIndexArr.splice(5, 1);
            }
            let sourbombNum = 0;
            if(bricksWithBombsLocal[i - 1].bombNum !== -1) {
                for(var j = 0; j < sorroundIndexArr.length; j++) {
                // 点击的9方格必须存在才行
                if(bricksWithBombsLocal[sorroundIndexArr[j] - 1] && bricksWithBombsLocal[sorroundIndexArr[j] - 1].bombNum === -1) {
                    sourbombNum++;
                }
                }
                if(sourbombNum != 0) {
                bricksWithBombsLocal[i - 1].bombNum = sourbombNum;
                }
            }
        }
        return bricksWithBombsLocal
    }
}

export default PlaygroudMaker