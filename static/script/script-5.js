var board;
const alph= 'Nabcdefgh';
//var FEN='rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2';
//var FEN='k7/8/3K1b2/8/1n1r5/4N3/3Q4/8';
var FEN='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
var position=FEN.split(' ')[0];
var turn=FEN.split(' ')[1];
var cas=FEN.split(' ')[2];
var ePass=FEN.split(' ')[3];
var halfCount=FEN.split(' ')[4];
var fullCount=FEN.split(' ')[5];
const numbers=/[1-8]/;
const pNames='KQRBNPkqrbnp'.split('');
const UB=9812;
var adjBtn;
var clrBtn;
var saveBtn;
var loadBtn;
var editZone;
var adjAct=false;
var adjFocus;
var plt;
var pltPos;
var pltPosX;
var pltRelPos;
var shift;
var colorDefault=true;
const yin='☯';
const del=String.fromCharCode(10060);
var actSquare;
var promAct=false;

console.log(position);
board = document.createElement('div');
board.className='board';
document.body.append(board);
for (let i = 8; i > 0; i--){
    for (let j = 1; j < 9; j++) {
        let square=document.createElement('div');
        square.classList.add('_'+alph.charAt(j),'_'+i);
        square.x=j;
        square.y=i;
        if((i+j)%2==1)
        {
            square.classList.add('white');
        }
        else
        {
            square.classList.add('black');
        }
        if (square.classList[0]=='_a')
        {
            let index = document.createElement('div');
            index.className='Vindex';
            index.textContent=i;
            square.append(index);
        }
        if(square.classList[1]=='_1')
        {
            let index = document.createElement('div');
            index.className='Hindex';
            index.textContent=alph.charAt(j);
            square.append(index);
        }
        square.classList.add('square');
        square.addEventListener('dragover', function(ev)
        {
            ev.preventDefault();
        }
        );
        board.append(square);
        //console.log(square);
    }
}
window.addEventListener('resize', resizer);
resizer();
setPosition();

editZone=document.createElement('div');
editZone.className='editZone';
document.body.append(editZone);
resizer();
adjBtn=document.createElement('button');
adjBtn.innerHTML='Редактировать<br>позицию';
editZone.append(adjBtn);
adjBtn.style.color='grey';
adjBtn.addEventListener('click', function()
{
    adjAct=!adjAct;
    document.querySelectorAll('.palette').forEach(element => {
        element.remove();
    });
    if (adjAct) 
    {
        adjBtn.style.color='black';    
        document.querySelectorAll('.square').forEach(element => {
            element.addEventListener('click', palette);
        });
    }
    else
    {
        document.querySelectorAll('.square').forEach(element => {
            element.removeEventListener('click', palette);
        });
        adjBtn.style.color='grey';
        updateCas();
        ePass='-';
        initiative();
    }
}
);
clrBtn=document.createElement('button');
clrBtn.innerHTML='Очистить<br>доску';
clrBtn.addEventListener('click', clearAll);
editZone.append(clrBtn);

saveBtn=document.createElement('button');
saveBtn.innerHTML='Сохранить<br>игру';
saveBtn.addEventListener('click', positionToFEN);
editZone.append(saveBtn);

loadBtn=document.createElement('button');
loadBtn.innerHTML='Загрузить<br>игру';
loadBtn.addEventListener('click', function()
{
    if(!adjAct)
    {
    FEN=localStorage.game;
    position=FEN.split(' ')[0];
    turn=FEN.split(' ')[1];
    cas=FEN.split(' ')[2];
    ePass=FEN.split(' ')[3];
    halfCount=FEN.split(' ')[4];
    fullCount=FEN.split(' ')[5];
    console.log(FEN);
    document.querySelectorAll('.palette').forEach(element => {
        element.remove();
    });
    setPosition();
    }
}
);
editZone.append(loadBtn);

function resizer()
{
    let bsize=0.9*(Math.min(window.innerWidth,window.innerHeight));
    board.style.width=bsize+'px';
    board.style.height=bsize+'px';
    shift=bsize/16;
    if(editZone!=null)
    {
        editZone.style.width=bsize+'px';
    }
    if(plt!=null)
    {
        pltPos=pltRelPos*(bsize-1)-1;
        if (adjAct) 
        {
            plt.style.width=bsize+'px';
        }
        else
        {
            plt.style.width=bsize/2+'px';
        }
        plt.style.height=(bsize/8)+'px';
        plt.style.top=pltPos+'px';
        plt.style.left=board.offsetWidth/ pltPosX+'px';
    }
    let psize=0.08*bsize;
    let fsize=0.04*bsize;
    let v=document.querySelectorAll('.Vindex');
    let h=document.querySelectorAll('.Hindex');
    let p=document.querySelectorAll('.piece');
    v.forEach(element => {
        element.style.fontSize = fsize+'px';
    });
    
    h.forEach(element => {
        element.style.fontSize = fsize+'px';
    });
    p.forEach(element => {
        element.style.fontSize=psize+'px';
    });
}

function setPosition()
{
    clearAll();
    for (let i = 8; i > 0; i--){
        let rank=position.split('/')[8-i];
        k=0;
        for (let j = 1; j < 9; j++)
        {
            let coord="._"+alph[j]+'._'+i; //._a._8
            let square=document.querySelector(coord);
            if (rank[k].match(numbers)) {
                j=j+Number(rank[k])-1;
            }
            else
            {
                let piece=document.createElement('div');
                piece.className='piece';
                pNames.forEach(element => {
                    if (element==rank[k]) {
                        piece.textContent=String.fromCharCode(UB+pNames.indexOf(element));
                        piece.classList.add(element);
                        if(element==element.toLowerCase())
                        {
                            piece.classList.add('bp');
                        }
                        else
                        {
                            piece.classList.add('wp');
                        }
                    }
                });
                piece.x=square.x;
                piece.y=square.y;
                // piece.addEventListener('click', function(ev)
                // {
                //     checkMoves(ev.target);
                // }
                // );
                square.append(piece);
            }
            k++;
        }
    }
    resizer();
    initiative();
}

function genMoves(piece)
{
    if(!adjAct)
    {
        document.querySelectorAll('.high').forEach(element => 
            {
                element.remove();    
            });
            let moves=[];
            switch (piece.classList[1]) 
            {
                case 'k' :
                case 'K' :
                    moves=kMoves(piece);
                    break;
        
                case 'q' :
                case 'Q' :
                    moves=qMoves(piece);
                    break;
        
                case 'r' :
                case 'R' :
                    moves=rMoves(piece);
                    break;
        
                case 'b' :
                case 'B' :
                    moves=bMoves(piece);
                    break;
            
                case 'n' :
                case 'N' :
                    moves=nMoves(piece);
                    break;
                
                case 'p' :
                case 'P' :
                    moves=pMoves(piece);
                    break;
                default:
                    break;
            }
            //console.log(moves);
            return moves;
            
    }
}
function coordToSquare(x,y)
{
    let coord='._'+alph[x]+'._'+y;
    return document.querySelector(coord);
}
function rMoves(piece)
{
    let moves=[];
    let x = piece.x;
    let y = piece.y;
    for (x++; x<9; x++) 
    {
        let test=coordToSquare(x,y);
        if (empty(test))
        {
            moves.push(test);
        }
        else
        {
            if(piece.classList[2]!=test.querySelector('.piece').classList[2])
            {
                moves.push(test);
            }
            break;
        }
    }
    x = piece.x;
    y = piece.y;
    for (x--; x>0; x--) 
    {
        let test=coordToSquare(x,y);
        if (empty(test))
        {
            moves.push(test);
        }
        else
        {
            if(piece.classList[2]!=test.querySelector('.piece').classList[2])
            {
                moves.push(test);
            }
            break;
        }
    }
    x = piece.x;
    y = piece.y;
    for (y++; y<9; y++) 
    {
        let test=coordToSquare(x,y);
        if (empty(test))
        {
            moves.push(test);
        }
        else
        {
            if(piece.classList[2]!=test.querySelector('.piece').classList[2])
            {
                moves.push(test);
            }
            break;
        }
    }
    x = piece.x;
    y = piece.y;
    for (y--; y>0; y--) 
    {
        let test=coordToSquare(x,y);
        if (empty(test))
        {
            moves.push(test);
        }
        else
        {
            if(piece.classList[2]!=test.querySelector('.piece').classList[2])
            {
                moves.push(test);
            }
            break;
        }
    }
    return moves;
}
function bMoves(piece)
{
    let moves=[];
    let x = piece.x;
    let y = piece.y;
    for (x++; x<9; x++) 
    {
        y++;
        if(y<9)
        {let test=coordToSquare(x,y);
            if (empty(test))
            {
                moves.push(test);
            }
            else
            {
                if(piece.classList[2]!=test.querySelector('.piece').classList[2])
                {
                    moves.push(test);
                }
                break;
            }}
    }
    x = piece.x;
    y = piece.y;
    for (x--; x>0; x--) 
    {
        y--;
        if(y>0)
        {let test=coordToSquare(x,y);
            if (empty(test))
            {
                moves.push(test);
            }
            else
            {
                if(piece.classList[2]!=test.querySelector('.piece').classList[2])
                {
                    moves.push(test);
                }
                break;
            }}
    }
    x = piece.x;
    y = piece.y;
    for (y++; y<9; y++) 
    {
        x--;
        if(x>0)
        {let test=coordToSquare(x,y);
            if (empty(test))
            {
                moves.push(test);
            }
            else
            {
                if(piece.classList[2]!=test.querySelector('.piece').classList[2])
                {
                    moves.push(test);
                }
                break;
            }}
    }
    x = piece.x;
    y = piece.y;
    for (y--; y>0; y--) 
    {
        x++;
        if(x<9)
        {let test=coordToSquare(x,y);
            if (empty(test))
            {
                moves.push(test);
            }
            else
            {
                if(piece.classList[2]!=test.querySelector('.piece').classList[2])
                {
                    moves.push(test);
                }
                break;
            }}
    }
    return moves;
}
function qMoves(piece)
{
    let moves=[];
    moves=rMoves(piece).concat(bMoves(piece));
    return moves;
}
function kMoves(piece)
{
    let x = piece.x;
    let y = piece.y;
    let moves=[];
    for (let i = -1; i < 2; i++) 
    {
        for (let j = -1; j < 2; j++) 
        {
            let test = coordToSquare(x+i,y+j);
            if(test!=null & piece.parentElement!=test)
            {
                if (empty(test)) 
                {
                    moves.push(test);   
                }
                else
                {
                    if(piece.classList[2]!=test.querySelector('.piece').classList[2])
                {
                    moves.push(test);
                }
                }
            }
        }
    }
    return moves;
}
function nMoves(piece)
{
    let x = piece.x;
    let y = piece.y;
    let moves=[];
    for (let i = -2; i < 3; i++) 
    {
        if (i==0){continue}
        for (let j = -2; j < 3; j++) 
        {
            if (j==0){continue}
            if (Math.abs(i)!=Math.abs(j))
            {
            let test=coordToSquare(x+i,y+j);
            if(test!=null)
            {
                if (empty(test)) 
                {
                    moves.push(test);   
                }
                else
                {
                    if(piece.classList[2]!=test.querySelector('.piece').classList[2])
                {
                    moves.push(test);
                }
                }
            }
            }
        }    
    }
    return moves;
}
function pMoves(piece)
{
    let x = piece.x;
    let y = piece.y;
    let moves=[];
    if (piece.classList[2]=='wp') 
    {
        let test=coordToSquare(x, y+1);
        if (empty(test)) 
        {
            moves.push(test);
            if (y==2) 
            {
                let test=coordToSquare(x, y+2);
                if (empty(test)) 
                {
                    moves.push(test);
                } 
            }   
        }
            test=coordToSquare(x-1,y+1)
            if (test!=null) 
            {
                if (!empty(test)) 
                    
                    {
                        if(piece.classList[2]!=test.querySelector('.piece').classList[2])
                    {
                        moves.push(test);
                    }
                    }
                    if (test==algebraToSquare(ePass)) 
                    {
                        moves.push(test);
                    }  
            }        
            test=coordToSquare(x+1,y+1)
            if (test!=null) 
            {    
                if (!empty(test)) 
                    
                    {
                        if(piece.classList[2]!=test.querySelector('.piece').classList[2])
                    {
                        moves.push(test);
                    }
                    }
                    if (test==algebraToSquare(ePass)) 
                    {
                        moves.push(test);
                    } 
            }
            
    }
    else
    {
        let test=coordToSquare(x, y-1);
        if (empty(test)) 
        {
            moves.push(test);
            if (y==7) 
            {
                let test=coordToSquare(x, y-2);
                if (empty(test)) 
                {
                    moves.push(test);
                } 
            }   
        }
            test=coordToSquare(x-1,y-1)
            if (test!=null) 
            {
                if (!empty(test)) 
                    
                    {
                        if(piece.classList[2]!=test.querySelector('.piece').classList[2])
                    {
                        moves.push(test);
                    }
                    }
                    if (test==algebraToSquare(ePass)) 
                    {
                        moves.push(test);
                    }  
            }      
            test=coordToSquare(x+1,y-1)
            if (test!=null) 
            {    
                if (!empty(test)) 
                    
                    {
                        if(piece.classList[2]!=test.querySelector('.piece').classList[2])
                    {
                        moves.push(test);
                    }
                    }
                    if (test==algebraToSquare(ePass)) 
                    {
                        moves.push(test);
                    } 
            }
    }
    return moves;
}
function palette(event)
{
    if(event!=undefined)
    {
        let square=event.target;
        let posy=event.clientY;
        if(!square.classList[3]!='square')
        {
            square=square.parentElement;
        }
        adjFocus=square;
        if (adjFocus.y==1) 
        {
            pltRelPos=(posy-1-3*shift)/(board.clientHeight-1);
        }
        else
        {
            pltRelPos=(posy-1+shift)/(board.clientHeight-1);
        }
        //pltPos=posy;
        //console.log(posy);
    }
    resizer();
    document.querySelectorAll('.palette').forEach(element => {
        element.remove();
    });
    plt=document.createElement('div');
    plt.className='palette';
    document.body.append(plt);
    for (let i = 0; i < 8; i++) 
    {
        let square=document.createElement('div');
        square.classList.add('whiteP','square');
        plt.append(square);
        let piece=document.createElement('div');
        piece.className='piece';
        square.append(piece);
        if(colorDefault)
        {
            switch (i) {
                case 6:
                    piece.textContent=yin;
                    square.addEventListener('click', function()
                    {
                        colorDefault=!colorDefault;
                        palette();
                    }
                    );
                    break;

                case 7:
                    piece.textContent=del;
                    square.addEventListener('click', function()
                    {
                        clear(adjFocus);
                    }
                    );
                    break;

                default:
                    piece.textContent=String.fromCharCode(UB+i);
                    piece.classList.add(pNames[i],'wp');
                    square.addEventListener('click', function()
                    {
                        move(square, adjFocus);
                    }
                    );
                    // piece.addEventListener('click', function(ev)
                    // {
                    //     checkMoves(ev.target);
                    // }
                    // );
                    break;
            }
        }
        else
        {
            switch (i) {
                case 6:
                    piece.textContent=yin;
                    square.addEventListener('click', function()
                    {
                        colorDefault=!colorDefault;
                        palette();
                    }
                    );
                    break;

                case 7:
                    piece.textContent=del;
                    square.addEventListener('click', function()
                    {
                        clear(adjFocus);
                    }
                    );
                    break;

                default:
                    piece.textContent=String.fromCharCode(UB+i+6);
                    piece.classList.add(pNames[i+6],'bp');
                    square.addEventListener('click', function()
                    {
                        move(square, adjFocus);
                    }
                    );
                    // piece.addEventListener('click', function(ev)
                    // {
                    //     checkMoves(ev.target);
                    // }
                    // );
                    break;
            }
        }
    }
    resizer();

    
}
function clear(square)
{
    square.querySelectorAll('.piece').forEach(element => {
        element.remove();
    });
}
function clearAll()
{
    document.querySelectorAll('.square').forEach(element => {
        clear(element);
    });
}
function move(from,to)
{
    let piece= from.querySelector('.piece');
    if(piece!=null)
    {
        clear(to);
        to.append(piece);
        piece.x=to.x;
        piece.y=to.y;
    }
}
function empty(square)
{
    if (square.querySelector('.piece')==null) 
    {
        return true;    
    }
    else
    {
        return false;
    }
}
function positionToFEN()
{
    position="";
    for (let i = 8; i > 0; i--) 
    {
        let rank='';
        let number=0;
        let level="._"+i;
        board.querySelectorAll(level).forEach(element => {
            if (empty(element)) 
            {
                number++;    
            }
            else
            {
                if(number>0)
                {
                    rank+=number;
                    number=0;
                }
                rank+=element.querySelector('.piece').classList[1];
            }
        });
        if(number>0)
        {
        rank+=number;
        }
        if(position!='')
        {
        position=position+('/'+rank);
        }
        else
        {
            position+=rank;
        }
    }
    FEN=position+' '+turn+' '+cas+' '+ePass+' '+halfCount+' '+fullCount;
    localStorage.game=FEN;
    console.log(FEN);
}
function highlight(moves)
{
    moves.forEach(element => {
        let h=document.createElement('div');
        h.className='high';
        element.append(h);
    });
}
function checkMoves(piece)
{
    if(!adjAct||!promAct)
    {
        let square=piece.parentElement;
        let moves=[];
        let color=piece.classList[2];
        actSquare=square;

        board.querySelectorAll('.square').forEach(element => {
            element.removeEventListener('click',callMove);
            element.removeEventListener('drop', callMove);
            element.removeEventListener('click', castle);
            element.removeEventListener('drop', castle);
        });
        genMoves(piece).forEach(element => 
        {
            if(empty(element))
            {
                move(square,element)
                if (!foeMoves(color).includes(kingPosition())) 
                {
                    moves.push(element);
                }
                move(element,square);
            }
            else
            {
                let foe=element.querySelector('.piece');
                move(square,element)
                if (!foeMoves(color).includes(kingPosition())) 
                {
                    moves.push(element);
                }
                move(element,square);
                element.append(foe);
            }
        });
        moves.forEach(element => {
            element.addEventListener('click',callMove);
            element.addEventListener('drop', callMove);
        });
        if (piece.classList[1]=='K') 
        {
            if (cas.includes('K')) 
            {
                if (empty(coordToSquare(6,1))& empty(coordToSquare(7,1))) 
                {
                    if ((!foeMoves(color).includes(coordToSquare(5,1)))&(!foeMoves(color).includes(coordToSquare(6,1)))& (!foeMoves(color).includes(coordToSquare(7,1)))) 
                    {
                        moves.push(coordToSquare(7,1));
                        coordToSquare(7,1).addEventListener('click', castle);
                        coordToSquare(7,1).addEventListener('drop', castle);
                    }
                }
            }
            if (cas.includes('Q')) 
            {
                if (empty(coordToSquare(2,1))& empty(coordToSquare(3,1))& empty(coordToSquare(4,1))) 
                {
                    if ((!foeMoves(color).includes(coordToSquare(2,1)))&(!foeMoves(color).includes(coordToSquare(3,1)))& (!foeMoves(color).includes(coordToSquare(4,1)))& (!foeMoves(color).includes(coordToSquare(5,1)))) 
                    {
                        moves.push(coordToSquare(3,1));
                        coordToSquare(3,1).addEventListener('click', castle);
                        coordToSquare(3,1).addEventListener('drop', castle);
                    }
                }
            }
        }
        if (piece.classList[1]=='k') 
        {
            if (cas.includes('k')) 
            {
                if (empty(coordToSquare(6,8))& empty(coordToSquare(7,8))) 
                {
                    if ((!foeMoves(color).includes(coordToSquare(5,8)))&(!foeMoves(color).includes(coordToSquare(6,8)))& (!foeMoves(color).includes(coordToSquare(7,8)))) 
                    {
                        moves.push(coordToSquare(7,8));
                        coordToSquare(7,8).addEventListener('click', castle);
                        coordToSquare(7,8).addEventListener('drop', castle);
                    }
                }
            }
            if (cas.includes('q')) 
            {
                if (empty(coordToSquare(2,8))& empty(coordToSquare(3,8))& empty(coordToSquare(4,8))) 
                {
                    if ((!foeMoves(color).includes(coordToSquare(2,8)))&(!foeMoves(color).includes(coordToSquare(3,8)))& (!foeMoves(color).includes(coordToSquare(4,8)))& (!foeMoves(color).includes(coordToSquare(5,8)))) 
                    {
                        moves.push(coordToSquare(3,8));
                        coordToSquare(3,8).addEventListener('click', castle);
                        coordToSquare(3,8).addEventListener('drop', castle);
                    }
                }
            }
        }
        highlight (moves);
    }
}
function kingPosition(color)
{
    let king='';
    if (color=='wp') 
    {
        king='K';    
    }
    else
    {
        king='k';
    }
    return board.getElementsByClassName(king)[0].parentElement;;
}
function foeMoves(color)
{
    let moves=[];
    if (color=='wp') 
    {
        color='.bp';
    }
    else
    {
        color='.wp';
    }
    board.querySelectorAll(color).forEach(element => 
    {
        moves=moves.concat(genMoves(element));
    });
    return moves;
}
function callMove(ev)
{
    let square=ev.target;

    board.querySelectorAll('.square').forEach(element => {
        element.removeEventListener('click',callMove);
        element.removeEventListener('drop',callMove);
        element.removeEventListener('click', castle);
        element.removeEventListener('drop', castle);
    });
    if (square.classList[3]!='square') 
    {
        square=square.parentElement;
    }
    if (!empty(square)||(actSquare.querySelector('.P')!=null)||(actSquare.querySelector('.p')!=null)) 
    {
        halfCount=0;
    }
    else
    {
        halfCount++;
    }
    move(actSquare,square);
    if ((square.querySelector('.P')!=null)&square.y==8) 
    {
        promote(square);
    }
    if ((square.querySelector('.p')!=null)&square.y==1) 
    {
        promote(square);
        // alert('prom!')
    }
    if (((square.querySelector('.P')!=null)||(square.querySelector('.p')!=null))&(square==algebraToSquare(ePass))) 
    {
        if (square.y==6) 
        {
            clear(coordToSquare(square.x,5))
        }
        else
        {
            clear(coordToSquare(square.x,4))
        }
    }
    if ((square.querySelector('.P')!=null)&(actSquare.y==2)&(square.y==4)) 
    {
        ePass=square.classList[0].slice(1)+'3';
    }
    else 
    {
        if ((square.querySelector('.p')!=null)&(actSquare.y==7)&(square.y==5)) 
        {
            ePass=square.classList[0].slice(1)+'6';
        }
        else
        {
            ePass='-'
        }
    }
    if (square.querySelector('.bp')!=null) 
    {
        fullCount++;
    }

    updateCas();
    changeTurn();
    //console.log(halfCount);
}
function initiative()
{
    let color='.'+turn+'p';

    board.querySelectorAll('.piece').forEach(element => {
        element.removeEventListener('click', callCheckMoves);
        element.setAttribute('draggable', 'false');
        element.removeEventListener('dragstart',callCheckMoves);
    });
    board.querySelectorAll(color).forEach(element => {
        element.addEventListener('click', callCheckMoves);
        element.setAttribute('draggable', 'true');
        element.addEventListener('dragstart',callCheckMoves);
    });
}
function callCheckMoves(ev)
{
    if (!promAct) 
    {
        checkMoves(ev.target);
    }
}
function changeTurn()
{
    if (turn=='w') 
    {
        turn='b';    
    }
    else
    {
        turn='w';
    }
    console.log(halfCount,fullCount);
    initiative();
}
function castle(ev)
{
    let square=ev.target;

    board.querySelectorAll('.square').forEach(element => {
        element.removeEventListener('click',callMove);
        element.removeEventListener('drop',callMove);
        element.removeEventListener('click', castle);
        element.removeEventListener('drop', castle);
    });
    if (square.classList[3]!='square') 
    {
        square=square.parentElement;
    }
    move(actSquare,square);
    if (square.x==7) 
    {
        move(coordToSquare(8,square.y),coordToSquare(6,square.y))
    }
    if (square.x==3) 
    {
        move(coordToSquare(1,square.y),coordToSquare(4,square.y))
    }
    updateCas();
    ePass='-';
    halfCount++;
    if (square.y==8) 
    {
        fullCount++
    }
    changeTurn();
}
function updateCas()
{
    if (kingPosition('wp')!=coordToSquare(5,1)) 
    {
        cas=cas.replace('K','');
        cas=cas.replace('Q','');
    }
    if (kingPosition('bp')!=coordToSquare(5,8)) 
    {
        cas=cas.replace('k','');
        cas=cas.replace('q','');
    }
    if (coordToSquare(8,1).querySelector('.R')==null) 
    {
        cas=cas.replace('K','');
    }
    if (coordToSquare(1,1).querySelector('.R')==null) 
    {
        cas=cas.replace('Q','');
    }
    if (coordToSquare(8,8).querySelector('.r')==null) 
    {
        cas=cas.replace('k','');
    }
    if (coordToSquare(1,8).querySelector('.r')==null) 
    {
        cas=cas.replace('q','');
    }
    if (cas=='') 
    {
        cas='-';
    }
}
function algebraToSquare(pos)
{
    let posX='._'+pos.slice(0,1);
    let posY='._'+pos.slice(1);
    return board.querySelector(posX+posY);
}
function promote(targetSquare)
{
    promAct=true;
    if(event!=undefined)
    {
        
        let posy=targetSquare.offsetHeight;
        adjFocus=targetSquare;
        if (adjFocus.y==1) 
        {
            pltRelPos=(posy*7.5-1-3*shift)/(board.clientHeight-1);
            
        }
        else
        {
            pltRelPos=(posy-1+shift)/(board.clientHeight-1);
        }
        //pltPos=posy;
        //console.log(posy);
    }
    //resizer();

    document.querySelectorAll('.palette').forEach(element => {
        element.remove();
    });
    plt=document.createElement('div');
    plt.className='palette';
    document.body.append(plt);
    plt.offsetLeft=targetSquare.offsetLeft;
    for (let i = 0; i < 4; i++) 
    {
        let square=document.createElement('div');
        square.classList.add('whiteProm','square');
        plt.append(square);
        let piece=document.createElement('div');
        piece.className='piece';
        square.append(piece);
        if(targetSquare.y==8)
        {
            switch (i) 
            {
                

                default:
                    piece.textContent=String.fromCharCode(UB+i+1);
                    piece.classList.add(pNames[i+1],'wp');
                    square.addEventListener('click', function()
                    {
                        move(square, adjFocus);
                        document.querySelectorAll('.palette').forEach(element => {
                            element.remove();
                            promAct=false;
                        });
                    }
                    );
                    // piece.addEventListener('click', function(ev)
                    // {
                    //     checkMoves(ev.target);
                    // }
                    // );
                    break;
            }
        }
        else
        {
            switch (i) {
                

                default:
                    piece.textContent=String.fromCharCode(UB+i+7);
                    piece.classList.add(pNames[i+7],'bp');
                    square.addEventListener('click', function()
                    {
                        move(square, adjFocus);
                        document.querySelectorAll('.palette').forEach(element => {
                            element.remove();
                        });
                    }
                    );
                    // piece.addEventListener('click', function(ev)
                    // {
                    //     checkMoves(ev.target);
                    // }
                    // );
                    break;
            }
        }
    }
    pltPosX=board.offsetWidth/(targetSquare.offsetLeft+targetSquare.offsetWidth/2-board.offsetWidth/4);
    if (pltPosX<2&pltPosX>0) 
    {
        pltPosX=2;
    }
    if(pltPosX<0)
    {
        pltPosX=20;
    }
    
    resizer();

    
}