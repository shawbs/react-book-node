
$(document).ready(function($){






    $('#booktypeSelect').on('click', '.dropdown-menu li',function(e){
        $('#booktype').val($(e.target).text());
        $('#booktypeSelect').find('.dropdown-toggle').html($(e.target).text() + ' <span class="caret"></span>');
    })


    //单项删除 
    $('.btn-delete').on('click',function(){
        console.log($(this).data('id'));


        $.get('/delete',{id:$(this).data('id')},function(data){
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
            $.post('/deleteMore',{ids:ids},function(data){
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
        if(action == '/bookadd'){
            bookUpload(form)
            .success(function(res){
                // $.post(action,form.serialize(),function(data){
                    console.log(res)
                    alert(res.message)
                // })
            })
            .error(function(err){
                console.log(err)
            })


            
        }

        if(action == '/bookedit'){
            console.log(form.serialize())
            $.post(action,form.serialize(),function(data){
                console.log(data)
                alert(data.message)
            })
        }
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
        $.get('/loginout',function(data){
            if(data.state){
                alert(data.message);
                location.pathname = '/admin/login'
            }
        })
    })


    //编辑器
    var E = window.wangEditor;
    var editor2 = new E('#editor');
    var $textarea = $('#textarea');
    editor2.customConfig.onchange = function(html){
        $textarea.val(html);
    }
    editor2.create();
    $textarea.val(editor2.txt.html());

})



function Login(){
    let form = $('#loginForm');
    $.post('/login',form.serialize(),function(data){
        if(data.state){

            // localStorage.setItem('token',data.token);
            // localStorage.setItem('userdata',data.data);
            // localStorage.setItem('account',data.data.username);
            // location.pathname = '/admin/book';
        }else{
            alert(data.message);
        }
    })
}

function bookUpload(form){
    let formData = new FormData(form[0]);
    // formData.append("bookfile", document.getElementById("bookfile").files[0]);   
    return $.ajax({
        url:'/bookupload',
        type:'POST',
        data:formData,
        contentType:false,
        processData:false
    })  
}




