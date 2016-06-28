<template>
    <canvas id="showing" width="520" height="350" style="border: 1px solid #999;"></canvas>
    <div id="answer-box">
        <span>Answer: </span>
        <input id="answer" type="text">
        <button id="submit">提交</button>
    </div>
</template>

<script>
    'use strict'
    export default {
        ready() {
            const ws = new WebSocket('ws://localhost:8090');
            const canvas = document.getElementById('showing')
            const cxt = canvas.getContext('2d')
            let moveToSwitch = 1
            ws.onmessage = (msg) => {
              let pathObj = msg.data.split('.')
              cxt.strokeStyle = "#000"
              
              if (moveToSwitch && msg.data != 'stop' && msg.data != 'clear') {
                  cxt.beginPath()
                  cxt.moveTo(pathObj[0], pathObj[1])
                  moveToSwitch = 0
              } else if (!moveToSwitch && msg.data == 'stop') {
                  cxt.beginPath()
                  cxt.moveTo(pathObj[0], pathObj[1])
                  moveToSwitch = 1
              } else if (moveToSwitch && msg.data == 'clear') {
                  cxt.clearRect(0, 0, 500, 500)
              } else if (msg.data == '答对了！！') {
                  alert('恭喜你答对了！！')
              }

              cxt.lineTo(pathObj[2], pathObj[3])
              cxt.stroke()
            }

            ws.onopen = () => {
                let submitBtn = document.getElementById('submit')
                submitBtn.onclick = () => {
                    let keyword = document.getElementById('answer').value
                    ws.send(keyword)
                }
            }
        }
    }
</script>

<style lang="less">
    #showing {
        background: lightblue;
    }
    #answer-box {
        margin: 10px 0;
    }
</style>