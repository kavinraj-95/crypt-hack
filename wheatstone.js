//Implementing Wheatstone-PlayFair Cipher

//function to generate key matrix
function generate_matrix(key, msg) {
    key = key.toLowerCase();
    let row = 0, col = 0;
    //initiate matrix 
    let matrix = [];
    //add key to the matrix
    let one_row = [];
    for(let i = 0; i < key.length; i++) {
        //if key goes more than 25 letters break that out
        if(row == 5) break;
        one_row.push(key[i]);
        if(col < 4){
            col++;
        }else{
            matrix.push(one_row);
            one_row = [];
            col = 0;
        }   
    }
    row = matrix.length
    //add other alphabets into matrix
    let last_row = 0, last_col = 0;             //to track the last letter which is not in msg
    for(let i = 97; i <= 122; i++) {
        if(!key.includes(String.fromCharCode(i)) && i != 106){            //if j is in the key, since we cant hold more than 25 letters we will remove the last one
            if(row == 5) {
                if(msg.includes(String.fromCharCode(i))){
                    matrix[last_row][last_col] = String.fromCharCode(i);
                    
                }break;
            }
            if(!(msg.includes(String.fromCharCode(i)))){
                last_row = row;
                last_col = col;
            }
            one_row.push(String.fromCharCode(i));
            if(col < 4){
                col++;
            }else{
                matrix.push(one_row);
                one_row = [];
                row++;
                col = 0;
            }
        }
    }

    return matrix;
}

//function to generate digraphs from message
function get_diagraphs(text){
    let digraphs = [];
    let i = 0;
    while(i < text.length) {
        let digraph = text[i];
        //if the last letter stands alone add a bogus letter 'z'
        if (i + 1 == text.length) {
            digraph += 'z';
        } //if both the letters in the digram are same then add a bogus letter 'z'
        else if (text[i] == text[i + 1]) {
            digraph += 'x';
            //you should not jump to the next two letter to take a step back and jump two letters
            i--;
        }//else just make a digram with the next letter
        else{
            digraph += text[i + 1];
        }
        digraphs.push(digraph);
        //move to the next pair
        i += 2;
    }
    return digraphs;
}

//function to search for a digraph in the key matrix
function search(matrix, digraph){
    let ele1 = digraph[0];
    let ele2 = digraph[1];
    let p1 = [-1, -1], p2 = [-1, -1];
    for(let i = 0; i < 5; i++){
        for(let j = 0; j < 5; j++) {
            if(matrix[i][j] == ele1){
                p1 = [i, j];
            }if(matrix[i][j] == ele2) {
                p2 = [i, j]
            }
        }
    }return [p1, p2];
}

//function to find the position of a 
function encrypt(key, message) {
    let key_mat = generate_matrix(key, message);
    let digraphs = get_diagraphs(message);
    let encrypted_text = "";
    for(let i = 0; i < digraphs.length; i++){
        let pos = search(key_mat, digraphs[i]);
        let p1 = pos[0], p2 = pos[1];
        //if both are in same column take the below element (% 5 makes sure you come back to top when there is no element below it)
        if(p1[0] == p2[0]){
            encrypted_text += key_mat[p1[0]][(p1[1] + 1) % 5];
            encrypted_text += key_mat[p2[0]][(p2[1] + 1) % 5];
        }
        // if both are in same row take the right element
        else if(p1[1] == p2[1]) {
            encrypted_text += key_mat[(p1[0] + 1) % 5][p1[1]];
            encrypted_text += key_mat[(p2[0] + 1) % 5][p2[1]];
        }
        // else just make a rectangle and take the elements from the opposite diagonal
        else{
            encrypted_text += key_mat[p1[0]][p2[1]];
            encrypted_text += key_mat[p2[0]][p1[1]];
        }
    }return encrypted_text;
}