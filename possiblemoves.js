var verticals=["1","2","3","4","5","6","7","8"]
var horizontals=["A","B","C","D","E","F","G","H"]
function Overfill(x,y) {
    if(0<=x && x<8 && 0<y && y<=8 ){
        return true
    }
    else{
        return false
    }
}
function possible_moves(x,y,color,type,pieces) {
    let moves=[]
    if(type=="pawn"){
        let pawndirection= color=="b" ? -1 : 1
        let firstrow= color=="b" ? 7 : 2
        if(!IsOccupied(x,y+1*pawndirection,pieces,color,type) ){
            Overfill(x,y+1*pawndirection) ? moves.push([x,y+1*pawndirection,"normal"]) :null
        }
        if(y==firstrow &&  !IsOccupied(x,y+2*pawndirection,pieces,color,type) && !IsOccupied(x,y+pawndirection,pieces,color,type)){
            Overfill(x,y+2*pawndirection) ? moves.push([x,y+2*pawndirection,"normal"]) :null
        }
        for (let k = -1; k < 2; k=k+2) {
            if(IsOccupied(x+k,y+pawndirection,pieces,color,"pawntattack")){
                Overfill(x+k,y+pawndirection) ? moves.push([x+k,y+pawndirection,"attack"]) : null
            }
            if(IsEnpass(x+k,y+pawndirection,pieces,pawndirection)  ){
                Overfill(x+k,y+pawndirection) ? moves.push([x+k,y+pawndirection,"attack"]) : null
            }
        }
        return moves
    }
    if(type=="knight"){
        for (let j = -1; j < 3; j=j+2) {
            for (let i = -1; i < 3; i=i+2) {
                if(!IsOccupied(x+2*i,y+1*j,pieces,color,"knightattack")[0]){
                    if(IsOccupied(x+2*i,y+1*j,pieces,color,"knightattack")[1]=="attack"){
                        Overfill(x+2*i,y+1*j) ? moves.push([x+2*i,y+1*j,"attack"]) : null 
                    }
                    else{
                        Overfill(x+2*i,y+1*j) ? moves.push([x+2*i,y+1*j,"normal"]) :null
                    }
                    
                }
                   
            }
        }
        for (let j = -1; j < 3; j=j+2) {
            for (let i = -1; i < 3; i=i+2) {
                if(!IsOccupied(x+1*i,y+2*j,pieces,color,"knightattack")[0]){
                    if (IsOccupied(x+1*i,y+2*j,pieces,color,"knightattack")[1]=="attack") {
                       Overfill(x+1*i,y+2*j) ? moves.push([x+1*i,y+2*j,"attack"]) :null
                    } else {
                        Overfill(x+1*i,y+2*j) ? moves.push([x+1*i,y+2*j,"normal"]) :null
                    }
                    
                }
            }
        }
        return moves
    } 
    if(type=="bishop"){
        let x_y_1=true
        let xy__1=true
        let y_1=true
        let x_1=true
        for (let i = 1; i < 8; i++) {
                if(!IsOccupied(x+i,y+i,pieces,color,"attacks") && x_y_1){
                    Overfill(x+i,y+i) ? moves.push([x+i,y+i,"normal"]) :null
                }
                else if(!IsAtackted(x+i,y+i,pieces,color,"attacks") && x_y_1){
                   moves.push([x+i,y+i,"attack"]) 
                    x_y_1=false
                    }
                else{
                    x_y_1=false
                }
                if(!IsOccupied(x-i,y+i,pieces,color,"attacks") && y_1){
                    Overfill(x-i,y+i) ? moves.push([x-i,y+i,"normal"]) :null
                }
                else if(!IsAtackted(x-i,y+i,pieces,color,"attacks") && y_1){
                    moves.push([x-i,y+i,"attack"]) 
                    y_1=false
                }
                else{
                    y_1=false
                    }
                if(!IsOccupied(x+i,y-i,pieces,color,"attacks") && x_1 ){
                    Overfill(x+i,y-i) ? moves.push([x+i,y-i,"normal"]) :null
                    
                }
                else if(!IsAtackted(x+i,y-i,pieces,color,"attacks") && x_1){
                     moves.push([x+i,y-i,"attack"]) 
                    x_1=false
                }
                else{
                    x_1=false
                }
                if(!IsOccupied(x-i,y-i,pieces,color,"attacks") && xy__1){
                    Overfill(x-i,y-i) ? moves.push([x-i,y-i,"normal"]) :null
                }
                else if(!IsAtackted(x-i,y-i,pieces,color,"attacks") && xy__1){
                    moves.push([x-i,y-i,"attack"])
                    xy__1=false
                }
                else{
                    xy__1=false
                    }
          }
          return moves
    } 
    if(type=="rook"){
        let x__1=true
        let y__1=true
        let y_1_=true
        let x_1_=true
        for (let i = 1; i < 8; i++) {
                if(!IsOccupied(x,y+i,pieces,color,"attacks") && y_1_){
                    Overfill(x,y+i) ? moves.push([x,y+i,"normal"]) :null
                }
                else if(!IsAtackted(x,y+i,pieces,color,"attacks") && y_1_){
                      moves.push([x,y+i,"attack"]) 
                    y_1_=false
                    }
                else{
                    y_1_=false
                }
                if(!IsOccupied(x,y-i,pieces,color,"attacks") && y__1){
                    Overfill(x,y-i) ? moves.push([x,y-i,"normal"]) :null
                }
                else if(!IsAtackted(x,y-i,pieces,color,"attacks") && y__1){
                    moves.push([x,y-i,"attack"])
                    y__1=false
                }
                else{
                    y__1=false
                    }
                if(!IsOccupied(x+i,y,pieces,color,"attacks") && x_1_ ){
                    Overfill(x+i,y) ? moves.push([x+i,y,"normal"]) :null
                    
                }
                else if(!IsAtackted(x+i,y,pieces,color,"attacks") && x_1_){
                    moves.push([x+i,y,"attack"])
                    x_1_=false
                }
                else{
                    x_1_=false
                }
                if(!IsOccupied(x-i,y,pieces,color,"attacks") &&  x__1){
                    Overfill(x-i,y) ? moves.push([x-i,y,"normal"]) :null
                }
                else if(!IsAtackted(x-i,y,pieces,color,"attacks") && x__1){
                    moves.push([x-i,y,"attack"])
                    x__1=false
                }
                else{
                    x__1=false
                    }
          }
          return moves
    }
    if(type=="queen"){
        let x_y_1=true
        let xy__1=true
        let y_1=true
        let x_1=true
        let x__1=true
        let y__1=true
        let y_1_=true
        let x_1_=true
        for (let i = 1; i < 8; i++) {
                if(!IsOccupied(x+i,y+i,pieces,color,"attacks") && x_y_1){
                    Overfill(x+i,y+i) ? moves.push([x+i,y+i,"normal"]) :null
                }
                else if(!IsAtackted(x+i,y+i,pieces,color,"attacks") && x_y_1){
                   moves.push([x+i,y+i,"attack"]) 
                    x_y_1=false
                    }
                else{
                    x_y_1=false
                }
                if(!IsOccupied(x-i,y+i,pieces,color,"attacks") && y_1){
                    Overfill(x-i,y+i) ? moves.push([x-i,y+i,"normal"]) :null
                }
                else if(!IsAtackted(x-i,y+i,pieces,color,"attacks") && y_1){
                    moves.push([x-i,y+i,"attack"]) 
                    y_1=false
                }
                else{
                    y_1=false
                    }
                if(!IsOccupied(x+i,y-i,pieces,color,"attacks") && x_1 ){
                    Overfill(x+i,y-i) ? moves.push([x+i,y-i,"normal"]) :null
                    
                }
                else if(!IsAtackted(x+i,y-i,pieces,color,"attacks") && x_1){
                     moves.push([x+i,y-i,"attack"]) 
                    x_1=false
                }
                else{
                    x_1=false
                }
                if(!IsOccupied(x-i,y-i,pieces,color,"attacks") && xy__1){
                    Overfill(x-i,y-i) ? moves.push([x-i,y-i,"normal"]) :null
                }
                else if(!IsAtackted(x-i,y-i,pieces,color,"attacks") && xy__1){
                    moves.push([x-i,y-i,"attack"])
                    xy__1=false
                }
                else{
                    xy__1=false
                    }
                    if(!IsOccupied(x,y+i,pieces,color,"attacks") && y_1_){
                        Overfill(x,y+i) ? moves.push([x,y+i,"normal"]) :null
                    }
                    else if(!IsAtackted(x,y+i,pieces,color,"attacks") && y_1_){
                          moves.push([x,y+i,"attack"]) 
                        y_1_=false
                        }
                    else{
                        y_1_=false
                    }
                    if(!IsOccupied(x,y-i,pieces,color,"attacks") && y__1){
                        Overfill(x,y-i) ? moves.push([x,y-i,"normal"]) :null
                    }
                    else if(!IsAtackted(x,y-i,pieces,color,"attacks") && y__1){
                        moves.push([x,y-i,"attack"])
                        y__1=false
                    }
                    else{
                        y__1=false
                        }
                    if(!IsOccupied(x+i,y,pieces,color,"attacks") && x_1_ ){
                        Overfill(x+i,y) ? moves.push([x+i,y,"normal"]) :null
                        
                    }
                    else if(!IsAtackted(x+i,y,pieces,color,"attacks") && x_1_){
                        moves.push([x+i,y,"attack"])
                        x_1_=false
                    }
                    else{
                        x_1_=false
                    }
                    if(!IsOccupied(x-i,y,pieces,color,"attacks") &&  x__1){
                        Overfill(x-i,y) ? moves.push([x-i,y,"normal"]) :null
                    }
                    else if(!IsAtackted(x-i,y,pieces,color,"attacks") && x__1){
                        moves.push([x-i,y,"attack"])
                        x__1=false
                    }
                    else{
                        x__1=false
                        }
          }
          return moves
    }
    if(type=="king"){
        for (let i = -1; i < 2; i++) { 
            for (let j = -1; j < 2; j++) {
              if(!IsOccupied(x+i,y+j,pieces,color,"kingattack")[0]){
                if (IsOccupied(x+i,y+j,pieces,color,"kingattack")[1]=="attack") {
                    Overfill(x+i,y+j) ? moves.push([x+i,y+j,"attack"]) : null
                } else {
                    Overfill(x+i,y+j) ? moves.push([x+i,y+j,"normal"]) : null
                }
                
              }
            }
        }
        for (let l = -2; l < 3; l=l+4) {
            let king_rook_direction= l==-2 ? 0 : 1
            if(IsRook(x-l,y,color,pieces)[0] && !IsOccupied(x-l,y,pieces,color,"kingattack") && !IsOccupied(x-l-1,y,pieces,color,"kingattack") && !IsOccupied(x-l+king_rook_direction,y,pieces,color,"kingattack") && !IsCheckMate(x-l,y,color,pieces) && !IsCheckMate(x-l-1,y,color,pieces) && !IsCheckMate(x,y,color,pieces) &&  !IsCheckMate(x-l+king_rook_direction,y,color,pieces)){
                moves.push([x-l,y,"normal"])
            }
        }
        return moves
    }
}
function show_moves(moves,kx,ky,kcolor,px,py) {
    let cells=chessboard.childNodes
    let moves_added=[]
    let ch_t=0
    for (let i = verticals.length; i >0; i--) {
        for (let j = 0; j < horizontals.length; j++) {
            let pm=[false,null]
            moves.forEach(move=>{
                    if(move[0]==j && move[1]==i){
                        if(px==kx && py==ky){
                            if(!IsCheck(move[0],move[1],kcolor,px,py,move[0],move[1],move[2],pieces)){
                                pm=[true,move[2]]
                            }
                        }
                        else{
                            if(!IsCheck(kx,ky,kcolor,px,py,move[0],move[1],move[2],pieces)){
                                pm=[true,move[2]]
                            }
                        }
                       
                    }
               
            })
            moves_added.push(pm) 
            }
    }

    cells.forEach((cell,index)=>{
      if(moves_added[index][0]){
        ch_t+=1
        cell.classList.add(`move_${moves_added[index][1]}`)
      }
    })
    return ch_t
}
function  IsCheckMate(x,y,color,pieces){
 let all_moves=[]
 pieces.forEach(piece=>{
   if(piece.type!="pawn"){
        if(piece.color!=color){
            piece.possiblemoves.forEach(p=>{
                all_moves.push(p)
            })
        }
   }
   else{
    if(piece.color!=color){
        let pawndirection= piece.color=="b" ? -1 : 1
        for (let k = -1; k < 2; k=k+2){
            all_moves.push([piece.x+k,piece.y+pawndirection,"attack"])
        } 
    }
   }
 })

for (let m = 0; m < all_moves.length; m++) {
    if(`${all_moves[m]}`==`${[x,y,"normal"]}` || `${all_moves[m]}`==`${[x,y,"attack"]}`){
        return true
    }
    
}
return false
}


function IsCheck(x,y,color,px,py,fx,fy,isattack,pieces) {
    let copy_pieces=JSON.parse(JSON.stringify(pieces))
    if(isattack=="attack"){
        copy_pieces.forEach((piece,i)=>{
            if(piece.x==fx && piece.y==fy){
               copy_pieces.splice(i,1)
            }
        })
    }
    copy_pieces.forEach(piece=>{
        if(piece.x==px && piece.y==py){
            piece.x=fx
            piece.y=fy
        }
    })
    copy_pieces.forEach(p=>{
        p.possiblemoves=possible_moves(p.x,p.y,p.color,p.type,copy_pieces)
    })
    if(IsCheckMate(x,y,color,copy_pieces)){
        return true
    }
    else{
        return false
    }
}

function IsGameOver(kx,ky,kcolor,pieces){
    let gameover=true
 pieces.forEach(piece=>{
    if(piece.color==kcolor){
        if(show_moves(piece.possiblemoves,kx,ky,kcolor,piece.x,piece.y)!=0){
            gameover=false
        }
    }

 })

return gameover
}