const chessboard=document.querySelector(".chessboard")
const pawnpromotion=document.querySelector(".pawnpromotion")
const prom_imgs=document.querySelectorAll(".prom")
const turns=document.querySelector(".turns")
const white_time=document.querySelector(".white_time")
const black_time=document.querySelector(".black_time")
const result=document.querySelector(".result")
const end=document.querySelector(".end")
var verticals=["1","2","3","4","5","6","7","8"]
var horizontals=["A","B","C","D","E","F","G","H"]
var black_repeat=0
var white_repeat=0
var repeat_moves_w=null;
var repeat_moves_b=null;
var board=[]
var pieces=[]
let turn="w"
let w_time_s=300
let b_time_s=300
let first_move=false
function creatingpieces() {
    for (let i = 0; i < 8; i++) {
        pieces.push({image:"/imgs/pawn_b.png",x:i,y:7,type:"pawn",color:"b",enpass:0,possiblemoves:[]})
    }
    for (let i = 0; i < 8; i++) {
        pieces.push({image:"/imgs/pawn_w.png",x:i,y:2,type:"pawn",color:"w",enpass:0,possiblemoves:[]})
    }
    for (let i = 0; i < 2; i++) {
        let type= i==0 ? "b" : "w"
        let y= type=="b"? 8 : 1
        pieces.push({image:`imgs/rook_${type}.png`,x:0,y:y,type:"rook",color:type,possiblemoves:[],castle:true})
        pieces.push({image:`imgs/knight_${type}.png`,x:1,y:y,type:"knight",color:type,possiblemoves:[]})
        pieces.push({image:`imgs/bishop_${type}.png`,x:2,y:y,type:"bishop",color:type,possiblemoves:[]})
        pieces.push({image:`imgs/queen_${type}.png`,x:3,y:y,type:"queen",color:type,possiblemoves:[]})
        pieces.push({image:`imgs/king_${type}.png`,x:4,y:y,type:"king",color:type,possiblemoves:[],castle:true})
        pieces.push({image:`imgs/rook_${type}.png`,x:7,y:y,type:"rook",color:type,possiblemoves:[],castle:true})
        pieces.push({image:`imgs/knight_${type}.png`,x:6,y:y,type:"knight",color:type,possiblemoves:[]})
        pieces.push({image:`imgs/bishop_${type}.png`,x:5,y:y,type:"bishop",color:type,possiblemoves:[]})
    }
}

function update_pieces(x,y,pieces,new_piece_image,new_piece_type) {
    for (let i = 0; i < pieces.length; i++) {
        if(pieces[i].x==x && pieces[i].y==y){
            pieces.splice(i,1)
            pieces.push({image:new_piece_image,x:x,y:y,type:new_piece_type,color:pieces[i].color})
            chessboard.innerHTML=""
            creatingboard()
            break
        }
    }
}
function creatingboard() {
    if(turn=="w"){
        turns.textContent="White Turn"
        turns.style.backgroundColor="black"
        turns.style.color="white"
    }
    else{
        turns.textContent="Black Turn"
        turns.style.backgroundColor="white"
        turns.style.color="black"
    }
    chessboard.innerHTML=""
    board=[]
    for (let i = verticals.length; i >0; i--) {
        for (let j = 0; j < horizontals.length; j++) {
            let picimage=undefined
            pieces.forEach(pic=>{
                if(pic.x==j && pic.y==i){
                    picimage=pic.image
                }
            })
            board.push(picimage) 
            }
    }
    t=0
    board.forEach((cell,index)=>{
        if(index%8==0 && index!=0){
            t= t==0 ? 1 :0
        }
        if(index%2==t){
            cell ? chessboard.innerHTML+=`<div style="width:100px;height:100px;background-color:white;display: flex;justify-content: center;align-items: center;" class="have_piece"><div style="background:url(${cell}) no-repeat ; background-position: center; width:80px;height:80px;background-size: cover;" class="${cell}"></div></div>` : chessboard.innerHTML+=`<div style="width:100px;height:100px;background-color:white; " class="empty"></div>`
        }
        else{
            cell ? chessboard.innerHTML+=`<div style="width:100px;height:100px;background-color:green;display: flex;justify-content: center;align-items: center; " class="have_piece"><div style="background:url(${cell}) no-repeat ; background-position: center; width:80px;height:80px;background-size: cover;" class="${cell}"></div></div>` :chessboard.innerHTML+=`<div style="width:100px;height:100px;background-color:green; " class="empty"></div>`
        }
    })
    movingpieces()
}

function movingpieces() {
    let cels=chessboard.childNodes
    cels.forEach(cell=>{
        cell.addEventListener("mousedown",(e)=>{
            let actpiece=null
            if(e.currentTarget.classList.contains("have_piece")){
                actpiece=e.currentTarget.firstElementChild
                actpiece.style.position="absolute"
                var gridx=Math.floor((e.clientX - chessboard.offsetLeft)/100)
                var gridy=Math.abs(Math.floor((e.clientY-chessboard.offsetTop )/100)-8)
                pieces.forEach(piece=>{
                    var kx;
                    var ky;
                    var kcolor;
                    if(piece.x==gridx && piece.y==gridy){
                        if(piece.color!=turn){
                            actpiece=null
                        }
                        else{
                            pieces.forEach(p=>{
                                if(p.type=="king" && p.color==piece.color){
                                     kx=p.x
                                     ky=p.y
                                     kcolor=p.color
                                }
                                p.possiblemoves=possible_moves(p.x,p.y,p.color,p.type,pieces)
                            })
                            show_moves(piece.possiblemoves,kx,ky,kcolor,gridx,gridy)
                        }

                    }
                })
                chessboard.addEventListener("mousemove",(e)=>{
                    if(actpiece){
                        let x=e.clientX - 40
                        let y=e.clientY-40
                        let chessboard_size=chessboard.getBoundingClientRect()
                        actpiece.style.position="absolute"
                        if(x<chessboard_size.left-40){
                            actpiece.style.left=`${chessboard_size.left+20}px`
                            actpiece=null
                            creatingboard()
                        }
                        else if(x>chessboard_size.right-40){
                            actpiece.style.left=`${chessboard_size.right-20}px`
                            e.clientX=chessboard_size.right-40
                            actpiece=null
                            creatingboard()
                        }
                        else{
                            actpiece.style.left=`${x}px`
                        }
                        
                        if(actpiece){
                            if(y<chessboard_size.top-40){
                                actpiece.style.top=`${chessboard_size.top-20}px`
                                actpiece=null
                                creatingboard()
                            }
                            else if(y>chessboard_size.bottom-40){
                                actpiece.style.top=`${chessboard_size.bottom+20}px`
                                actpiece=null
                                creatingboard()
                            }
                            else{
                                actpiece.style.top=`${y}px`
                            }
                        }
                       
                    }
                })
                chessboard.addEventListener("mouseup",(e)=>{
                    if(actpiece){
                    let fx=Math.floor((e.clientX - chessboard.offsetLeft)/100)
                    let fy=Math.abs(Math.floor((e.clientY-chessboard.offsetTop )/100)-8)
                    let rp_w=repeat_moves_w
                    let rp_b=repeat_moves_b
                    let rp_s_w=white_repeat
                    let rp_s_b=black_repeat
                    var kx;
                    var ky;
                    var kcolor;
                    let p_piece;
                    let  p_piece_count=pieces.length
                    pieces.forEach(p=>{
                        if(p.type=="king" && p.color!=turn){
                             kx=p.x
                             ky=p.y
                             kcolor=p.color
                        }
                        if(p.x==fx && p.y==fy){
                            p_piece=p
                        }
                        if(p.x==gridx && p.y==gridy){
                            c_piece=p
                        }
                    })
                    pieces.forEach(piece=>{
                        if (piece.x==gridx && piece.y == gridy) {
                            if(IsValid(gridx,gridy,fx,fy,piece.type,piece.color,pieces)){
                                if(piece.type=="king"){
                                    let px=piece.x
                                    let py=piece.y
                                    if(CreateRook(gridx,gridy,fx,fy,piece.type,piece.color,pieces)){
                                        if(fx-piece.x==2){
                                            if(!IsCheckMate(fx,fy,piece.color,pieces) && !IsCheckMate(fx-1,fy,piece.color,pieces) && !IsCheckMate(piece.x,piece.y,piece.color,pieces)){
                                                let rook=IsRook(fx,fy,piece.color,pieces)[1]
                                                rook.x= fx-1
                                                rook.y=fy
                                                piece.x=fx
                                                piece.y=fy
                                                piece.castle=false
                                                turn= turn=="b" ? "w" : "b"
                                                if(IsGameOver(kx,ky,kcolor,pieces) && IsCheckMate(kx,ky,kcolor,pieces)){
                                                    GameOver(`${turn=="b" ? "White" : "Black"} Won`)
                                                }
                                                else if (IsGameOver(kx,ky,kcolor,pieces)){
                                                    GameOver("Draw")
                                                }
                                                if(!first_move){
                                                    Clock_Time()
                                                }
                                                first_move=true
                                                if(`${[fx,fy]}`==`${repeat_moves_b}`){
                                                    black_repeat+=1
                                                }
                                                else if(`${[fx,fy]}`==`${repeat_moves_w}`){
                                                    white_repeat+=1
                                                }
                                                else{
                                                    black_repeat=0
                                                    white_repeat=0
                                                }
                                                if(piece.color=="b"){
                                                    repeat_moves_b=[px,py]
                                                }
                                                else if(piece.color=="w"){
                                                    repeat_moves_w=[px,py]
                                                }
                                            }
                                        }
                                        if(fx-piece.x==-2){
                                            if(!IsCheckMate(fx,fy,piece.color,pieces) && !IsCheckMate(fx-1,fy,piece.color,pieces) && !IsCheckMate(piece.x,piece.y,piece.color,pieces) && !IsCheckMate(fx+1,fy,piece.color,pieces) ){
                                                let rook=IsRook(fx,fy,piece.color,pieces)[1]
                                                rook.x=fx+1
                                                rook.y=fy
                                                piece.x=fx
                                                piece.y=fy
                                                piece.castle=false
                                                turn= turn=="b" ? "w" : "b"
                                                if(IsGameOver(kx,ky,kcolor,pieces) && IsCheckMate(kx,ky,kcolor,pieces)){
                                                    GameOver(`${turn=="b" ? "White" : "Black"} Won`)
                                                }
                                                else if (IsGameOver(kx,ky,kcolor,pieces)){
                                                    GameOver("Draw")
                                                }
                                                first_move=true
                                                if(`${[fx,fy]}`==`${repeat_moves_b}`){
                                                    black_repeat+=1
                                                }
                                                else if(`${[fx,fy]}`==`${repeat_moves_w}`){
                                                    white_repeat+=1
                                                }
                                                else{
                                                    black_repeat=0
                                                    white_repeat=0
                                                }
                                                if(piece.color=="b"){
                                                    repeat_moves_b=[px,py]
                                                }
                                                else if(piece.color=="w"){
                                                    repeat_moves_w=[px,py]
                                                }
                                            }
                                        }
                                       
                                    } 
                                    else{
                                        for (let i = -1; i < 2; i++) { 
                                            for (let j = -1; j < 2; j++) {
                                              if(fx-gridx==i && fy-gridy==j){
                                                piece.x=fx
                                                piece.y=fy
                                                piece.castle=false
                                                if(piece.type=="rook"){
                                                    piece.castle=false
                                                }
                                                turn= turn=="b" ? "w" : "b"
                                                pieces.forEach(p=>{
                                                    p.possiblemoves=possible_moves(p.x,p.y,p.color,p.type,pieces)
                                                })
                                                if(IsGameOver(kx,ky,kcolor,pieces) && IsCheckMate(kx,ky,kcolor,pieces)){
                                                    GameOver(`${turn=="b" ? "White" : "Black"} Won`)
                                                }
                                                else if (IsGameOver(kx,ky,kcolor,pieces)){
                                                    GameOver("Draw")
                                                }
                                                first_move=true
                                                if(!first_move){
                                                    Clock_Time()
                                                }
                                                if(`${[fx,fy]}`==`${repeat_moves_b}`){
                                                    black_repeat+=1
                                                }
                                                else if(`${[fx,fy]}`==`${repeat_moves_w}`){
                                                    white_repeat+=1
                                                }
                                                else{
                                                    black_repeat=0
                                                    white_repeat=0
                                                }
                                                if(piece.color=="b"){
                                                    repeat_moves_b=[px,py]
                                                }
                                                else if(piece.color=="w"){
                                                    repeat_moves_w=[px,py]
                                                }
        
                                                if(IsCheckMate(fx,fy,piece.color,pieces)){
                                                    piece.x=px
                                                    piece.y=py
                                                    if(p_piece_count>pieces.length){
                                                        pieces.push(p_piece)
                                                    }
                                                    repeat_moves_b=rp_b
                                                    repeat_moves_w=rp_w
                                                    black_repeat= rp_s_b
                                                    white_repeat=  rp_s_w
                                                    piece.castle=true
                                                    if(piece.type=="rook"){
                                                        piece.castle=true
                                                    }
                                                    turn= turn=="b" ? "w" : "b"
                                                }
                                                }
                                                }
                                            }
                                        }
                                       
                                }
                                else{
                                    let px=piece.x
                                    let py=piece.y
                                    piece.x=fx
                                    piece.y=fy
                                    turn= turn=="b" ? "w" : "b"
                                    pieces.forEach(p=>{
                                        p.possiblemoves=possible_moves(p.x,p.y,p.color,p.type,pieces)
                                    })
                                    if(IsGameOver(kx,ky,kcolor,pieces) && IsCheckMate(kx,ky,kcolor,pieces)){
                                        GameOver(`${turn=="b" ? "White" : "Black"} Won`)
                                    }
                                    else if (IsGameOver(kx,ky,kcolor,pieces)){
                                        GameOver("Draw")
                                    }
                                    if(!first_move){
                                        Clock_Time()
                                    }
                                    first_move=true
                                    if(`${[fx,fy]}`==`${repeat_moves_b}`){
                                        black_repeat+=1
                                    }
                                    else if(`${[fx,fy]}`==`${repeat_moves_w}`){
                                        white_repeat+=1
                                    }
                                    else{
                                        black_repeat=0
                                        white_repeat=0
                                    }
                                    if(piece.color=="b"){
                                        repeat_moves_b=[px,py]
                                    }
                                    else if(piece.color=="w"){
                                        repeat_moves_w=[px,py]
                                    }
                                    if(piece.type=="rook"){
                                        piece.castle=false
                                    }
                                    for (let j = 0; j < pieces.length; j++) {
                                        if(pieces[j].type=="king" && pieces[j].color==piece.color ){
                                            if(IsCheckMate(pieces[j].x,pieces[j].y,pieces[j].color,pieces)){
                                                piece.x=px
                                                piece.y=py
                                                if(p_piece_count>pieces.length){
                                                    pieces.push(p_piece)
                                                }
                                                repeat_moves_b=rp_b
                                                repeat_moves_w=rp_w
                                                black_repeat= rp_s_b
                                                white_repeat= rp_s_w
                                                turn= turn=="b" ? "w" : "b"
                                                if(piece.type=="rook"){
                                                    piece.castle=true
                                                }
                                            }
                                        }
                                    }
                                }
                              let finalrow= piece.color=="b" ? 1 : 8
                              if(piece.type=="pawn" && piece.y==finalrow){
                                pawnpromotion.style.display="flex"
                                prom_imgs.forEach(prm=>{
                                    if(prm.classList[0]=="rook_promotion"){
                                        prm.setAttribute("src",`imgs/rook_${piece.color}.png`)
                                    }
                                    else if(prm.classList[0]=="knight_promotion"){
                                        prm.setAttribute("src",`imgs/knight_${piece.color}.png`)
                                    }
                                    else if(prm.classList[0]=="bishop_promotion"){
                                        prm.setAttribute("src",`imgs/bishop_${piece.color}.png`)
                                    }
                                    else{
                                        prm.setAttribute("src",`imgs/queen_${piece.color}.png`)
                                    }
                                    prm.addEventListener("click",(e)=>{
                                        let current_prom=e.target
                                        if(current_prom.classList[0]=="rook_promotion"){
                                            update_pieces(piece.x,piece.y,pieces,`imgs/rook_${piece.color}.png`,"rook")
                                        }
                                        else if(prm.classList[0]=="knight_promotion"){
                                            update_pieces(piece.x,piece.y,pieces,`imgs/knight_${piece.color}.png`,"knight")
                                        }
                                        else if(prm.classList[0]=="bishop_promotion"){
                                            update_pieces(piece.x,piece.y,pieces,`imgs/bishop_${piece.color}.png`,"bishop")
                                        }
                                        else{
                                            update_pieces(piece.x,piece.y,pieces,`imgs/queen_${piece.color}.png`,"queen")
                                        }
                                        pawnpromotion.style.display="none"
                                    })    
                                })
                              }
                            }
                        }
                    })
                    if(black_repeat==3 && white_repeat==3 ){
                       GameOver("Draw")
                    }
                    actpiece=null
                    creatingboard()
                    }
                    
                })
            } 
        })
    })
}
creatingpieces()
creatingboard()
// chessboard.addEventListener("click",e=>{
//     var gridx=Math.floor((e.clientX - chessboard.offsetLeft)/100)
//     var gridy=Math.abs(Math.floor((e.clientY-chessboard.offsetTop )/100)-8)
//     console.log(gridx,gridy)
// })

function Clock_Time() {
   let a= setInterval(()=>{
         if(turn=="b"){
            b_time_s-=1
            second=MinuteConventor(b_time_s)[1]
            minute=MinuteConventor(b_time_s)[0]
            black_time.innerHTML=`${minute} : ${second>=10 ? second : "0"+ second }`
            if(b_time_s==0){
                GameOver("White Won")
            }
        }
        if(turn=="w"){
            w_time_s-=1
            second=MinuteConventor(w_time_s)[1]
            minute=MinuteConventor(w_time_s)[0]
            white_time.innerHTML=`${minute} : ${second>=10 ? second : "0"+ second }`
            if(w_time_s==0){
                GameOver("Black Won")
            }
        }
    },1000)
}
function MinuteConventor(time) {
    let minute=Math.floor(time/60)
    let second=time%60
    return [minute,second]
}

function GameOver(win) {
    end.style.display="flex"
    result.textContent=win
    turn="end"
}


`jjjj?ip=6;`ls``