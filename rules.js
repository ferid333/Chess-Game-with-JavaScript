function IsValid(x,y,fx,fy,type,color,pieces) {
    if(type=="pawn"){
        let pawndirection= color=="b" ? -1 : 1
        let firstrow= color=="b" ? 7 : 2
        if((fx-x==1 || fx-x==-1) && fy-y==pawndirection){
            if(IsOccupied(fx,fy,pieces,color,type) ){
                for (let i = 0; i < pieces.length; i++) {
                    if(pieces[i].x==fx && pieces[i].y==fy){
                        if(pieces[i].color==color){
                            return false
                        }
                        else{
                            pieces.splice(i,1)
                            return true
                        }
                    }
                }
            } 
            else if(IsEnpass(fx,fy,pieces,pawndirection)){
                for (let i = 0; i < pieces.length; i++) {
                    if(pieces[i].x==fx && pieces[i].y==fy-pawndirection){
                        if(pieces[i].color==color){
                            return false
                        }
                        else{
                            pieces.splice(i,1)
                            return true
                        }
                    }
                }
            }
            else{
                return false
            }         
        }
        if(x==fx && fy-y==pawndirection){
            if (!IsOccupied(fx,fy,pieces,color,type)) {
                pieces.forEach(item=>{
                    if(item.type=="pawn"){
                        if(item.x==x && item.y==y){
                            item.enpass=1
                        }
                        else{
                            item.enpass=0
                        }
                    }  
                })
                return true
            } else {
                return false
            }
        }

        else{
            if(x==fx && y==firstrow && fy-y==pawndirection*2){
                if(!IsOccupied(fx,fy-pawndirection,pieces,color,type) && !IsOccupied(fx,fy,pieces,color,type) ){
                    pieces.forEach(item=>{
                        if(item.type=="pawn"){
                            if(item.x==x && item.y==y){
                                item.enpass=1
                            }
                            else{
                                item.enpass=0
                            }
                        }  
                    })
                    return true
                }
                else{
                  return false
                }
                  
            }
            else{
                return false
            }
        }
    }
    else{
        pieces.forEach(item=>{
            if(item.type=="pawn"){
                    item.enpass=0
            }  
        })
        if(type=="knight"){

            for (let j = -1; j < 3; j=j+2) {
                for (let i = -1; i < 3; i=i+2) {
                    if(fx-x==2*i && fy-y==1*j){
                        return !IsOccupied(fx,fy,pieces,color,type) ? true : false
                   }
                }
            }
            for (let j = -1; j < 3; j=j+2) {
                for (let i = -1; i < 3; i=i+2) {
                    if(fx-x==1*i && fy-y==2*j){
                        return !IsOccupied(fx,fy,pieces,color,type) ? true : false
                   }
                }
            }
           
        }
        else if(type=="bishop"){
            let directionX= fx>x ? 1 : -1
            let directionY= fy>y ? 1 : -1
          for (let i = 1; i < 8; i++) {
            if(i<(fx-x)*directionX && i<(fy-y)*directionY){
                if(IsOccupied(x+i*directionX,y+i*directionY,pieces,color,type)){
                    return false
                }
            }
            if(fx-x==i*directionX && fy-y==i*directionY){
                return  IsAtackted(fx,fy,pieces,color,type) ?false :true
            }
          }
        }
        else if(type=="rook"){
            let directionX=(fx<x && fy==y) ? -1 : (fx>x && fy==y) ? 1 : 0
            let directionY=(fy<y && fx==x) ? -1 : (fy>y && fx==x) ? 1 : 0
            for (let i = 1; i < 8; i++) {
                if((i<(fy-y)*directionY || directionY==0) && (i<(fx-x)*directionX || directionX==0) ){
                    if(IsOccupied(x+i*directionX,y+i*directionY,pieces,color,type)){
                        return false
                    }
                }
                if(fx-x==i*directionX && fy-y==i*directionY){
                    return IsAtackted(fx,fy,pieces,color,type) ?false :true
                }
            }
        }
        else if(type=="queen"){
            let directionX=(fx<x) ? -1 : (fx>x) ? 1 : 0
            let directionY=(fy<y) ? -1 : (fy>y) ? 1 : 0
            for (let i = 1; i < 8; i++) {
                if((i<(fy-y)*directionY || directionY==0) && (i<(fx-x)*directionX || directionX==0)){
                    if(IsOccupied(x+i*directionX,y+i*directionY,pieces,color,type)){
                        return false
                    }
                }
                if(fx-x==i*directionX && fy-y==i*directionY){
                    return  IsAtackted(fx,fy,pieces,color,type) ? false :true
                }
              }
        }
        else if(type=="king"){
           for (let i = -1; i < 2; i++) { 
               for (let j = -1; j < 2; j++) {
                 if(fx-x==i && fy-y==j){
                    return !IsOccupied(fx,fy,pieces,color,type) ? true : false
                 }
               }
           }
           if(fy==y && (fx-x==2 || fx-x==-2)){
            for (let i = 0; i < pieces.length; i++) {
                if(pieces[i].x==x && pieces[i].y==y && pieces[i].castle==true){
                   return true
                }
            }
           }
        }
    }
}

function IsOccupied(x,y,pieces,color,type) {
    for (let i = 0; i < pieces.length; i++) {
        if(pieces[i].x==x && pieces[i].y==y){
            if(type=="pawntattack" && color==pieces[i].color){
                return false
            }
            if(type=="knightattack" ){
                return color==pieces[i].color ? [true,null] : [false,"attack"]
            }
            if(type=="kingattack"){
                return color==pieces[i].color ? [true,null] : [false,"attack"]
            }
            if(color==pieces[i].color){
                return true
            }
            else if(type=="knight"){
                pieces.splice(i,1)
                return false
            }
            else if(type=="king"){
                pieces.splice(i,1)
                return false
            }
            return true
        }
    }
    return false
}
function IsAtackted(fx,fy,pieces,color,type,x,y) {
    for (let i = 0; i < pieces.length; i++) {
        if(pieces[i].x==fx && pieces[i].y==fy){
            if(color==pieces[i].color){
                return true
            }
            else if(type=="attacks"){
                return false
            }
            else{
                pieces.splice(i,1)
                return false
            }
           
        }
    }
}
function IsEnpass(x,y,pieces,direction) {
    for (let i = 0; i < pieces.length; i++) {
        if(pieces[i].x==x && pieces[i].y==y-direction && pieces[i].enpass==1){
            return true
        }
    }
    return false
}
function IsRook(x,y,color,pieces) {
    var kx;
    var ky;
    for (let t = 0; t < pieces.length; t++) {
        if(pieces[t].type=="king" && pieces[t].color==color ){
            if(!pieces[t].castle){
                return false
            }
        }
    }
    for (let i = 0; i < pieces.length; i++) {
        if(pieces[i].x==x+1 && pieces[i].y==y && pieces[i].castle==true && pieces[i].color==color &&  pieces[i].type=="rook"){
            return [true,pieces[i]]
        }
        else if(pieces[i].x==x-2 && pieces[i].y==y && pieces[i].castle==true  && pieces[i].color==color &&  pieces[i].type=="rook"){
            return [true,pieces[i]]
        }
    }
    return [false,null]
}
function CreateRook(x,y,fx,fy,type,color,pieces) {
    if(fy==y && (fx-x==2 || fx-x==-2)){
        for (let i = 0; i < pieces.length; i++) {
            if(pieces[i].x==x && pieces[i].y==y && pieces[i].castle==true){
             if(IsRook(fx,fy,color,pieces)[0] && (fx-x==2 || fx-x==-2) && fy-y==0){
                 if(!IsOccupied(fx,fy,pieces,color,type) && !IsOccupied(fx-1,fy,pieces,color,type)){
                     return true
                 }
               
             }
             return false
            }
        }
       }

}