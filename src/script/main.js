
$(document).ready(function($){


    var footer = $('.footer');
    if(document.body.clientHeight<window.innerHeight){
        footer.css('position','absolute')
    }else{
        footer.css('position','static')
    }



    $('#booktypeSelect').on('click', '.dropdown-menu li',function(e){
        $('#booktype').val($(e.target).text());
        $('#booktypeSelect').find('.dropdown-toggle').html($(e.target).text() + ' <span class="caret"></span>');
    })


    //单项删除 
    $('.btn-delete').on('click',function(){
        console.log($(this).data('id'));


        $.get(API.removeBook,{id:$(this).data('id')},function(data){
            if(data.state){
                location.reload();
            }
            alert(data.message);
        })
    })

    //批量删除
    $('#remove_book_all').on('click',function(){
        let ids = [];
        $('.checkbox').each(function(index,item){
            if(item.checked == true){
                ids.push($(item).data('id'));
            }
        })

        if(ids.length > 0){
            $.post(API.removeBooks,{ids:ids},function(data){
                if(data.state){
                    location.reload();
                }
                alert(data.message)
            })
        }

    })


    //新增和修改
    $('#formbook_btn').on('click',function(){
        let form = $('#formBook');
        let action = $(this).data('action');
        // upload
        if(action == 'add'){
            bookAdd(form);    
        }
        
        if(action == 'edit'){
            bookEdit(form);
        }
    })


    $('#bookInput').change(function(){
        bookUpload()
        .success(function(res){
            $('.uploadtip').html(res.message)
        })
    })

    // user_goup
    $('#loginSubmitBtn').on('click',function(){
        Login();
    })
    $('#loginForm').on('keyup','.form-control',function(e){
        if(e.key=="Enter"){
            Login();
        }
    })

    $('#loginoutBtn').on('click',function(){
        $.get(API.exit,function(data){
            if(data.state){
                alert(data.message);
                location.pathname = '/admin/login.htm'
            }
        })
    })




})


//登录
function Login(){
    let form = $('#loginForm');
    $.post(API.login,form.serialize(),function(data){
        if(data.state){

            localStorage.setItem('token',data.token);
            // localStorage.setItem('userdata',data.data);
            localStorage.setItem('account',data.data.username);
            location.href = '/admin/book.htm';
        }else{
            alert(data.message);
        }
    })
}

//上传书籍
function bookUpload(){
    var formData = new FormData();
    var input = document.getElementById('bookInput');
    for(var i =0;i<input.files.length;i++){
        formData.append('books',input.files[i])
    }

    
    return $.ajax({
        url:API.bookUpload,
        type:'POST',
        data:formData,
        contentType:false,
        processData:false
    })  
}

function bookAdd(form){
    $.post(API.addBook,form.serialize(),function(data){
        alert(data.message)
    })
}

function bookEdit(form){
    $.post(API.editBook,form.serialize(),function(data){
        alert(data.message)
    })
}




