const log = val => console.log( val )
const get = val => document.querySelector( val )

var Jimp = require("E:/INSTALADOS/editoi-1.0.1-win-x64/editor/node_modules/jimp")

var guriWorks = {}

guriWorks.data = {}
guriWorks.data.lobby = {}
guriWorks.data.lobbies = {}

guriWorks.friends = {}

//greenworks.getFriends()

guriWorks.friends.getTotal = () => {
  return greenworks.getFriendCount( greenworks.FriendFlags['All'] )
}

guriWorks.friends.getNames = () => {
  var friends = greenworks.getFriends(greenworks.FriendFlags['All'])
  var friends_names = [];
  for (var i = 0; i < friends.length; ++i) friends_names.push( friends[i].getPersonaName() )
  return friends_names
}

guriWorks.friends.getSteamID = () => {
  var friends = greenworks.getFriends(greenworks.FriendFlags['All'])
  var friends_names = [];
  for (var i = 0; i < friends.length; ++i) friends_names.push( friends[i].getRawSteamID() )
  return friends_names
}

guriWorks.friends.getAllData = () => {
  var friends = greenworks.getFriends(greenworks.FriendFlags['All'])
  var friends_data = [];
  for (var i = 0; i < friends.length; ++i) friends_data.push( friends[i] )
  return friends_data
}

guriWorks.friends.getData = () => {
  var friends = greenworks.getFriends(greenworks.FriendFlags['All'])
  var friends_data = {}
  for (var i = 0; i < friends.length; ++i){
    var id = friends[i].getRawSteamID()
    friends_data[id] = { 
      username: friends[i].getPersonaName(),         
      isLobby: friends[i].isLobby(),
      id: id
    }
  }  
  return friends_data
}

guriWorks.friends.appendAvatar = async( src, appendID ) => { // "76561198346033522" - "#logs"

  $( appendID ).append(`<img src=${ src } />` )  
}

guriWorks.friends.appendAvatarByIndex = async( index, appendID ) => { // "76561198346033522" - "#logs"

  var array = []
  for(let index in guriWorks.data.friendsList){
    array.push( guriWorks.data.friendsList[index].imageSRC )    
  } 
  guriWorks.friends.appendAvatar( array[index], "#root" )
}

guriWorks.friends.appendAvatarAll = async() => { // "76561198346033522" - "#logs"

  for(let index in guriWorks.data.friendsList){
    guriWorks.friends.appendAvatar( guriWorks.data.friendsList[index].imageSRC, "#root" )
  }
}


guriWorks.friends.getAvatar = ( type, userID ) => { // "76561198346033522" - "#logs"

  return new Promise( async(resolve, rejected) => {

    var func = `get${type}FriendAvatar`
    var handle = greenworks[ func ]( userID )
    var image_buffer = greenworks.getImageRGBA( handle );

    var size = greenworks.getImageSize(handle);
    if (!size.height || !size.width) {
      console.log("Image corrupted. Please try again");
      return;
    }

    var image = await new Jimp(size.height, size.width, function (err, image) {
      for (var i = 0; i < size.height; ++i) {
        for (var j = 0; j < size.width; ++j) {
          var idx = 4 * (i * size.height + j);
          var hex = Jimp.rgbaToInt(image_buffer[idx], image_buffer[idx+1],
                                   image_buffer[idx+2], image_buffer[idx+3]);
          image.setPixelColor(hex, j, i);
        }
      }
      
      // image.resize(350, 350, Jimp.RESIZE_NEAREST_NEIGHBOR);
      /*
      Jimp.RESIZE_NEAREST_NEIGHBOR;
      Jimp.RESIZE_BILINEAR;
      Jimp.RESIZE_BICUBIC;
      Jimp.RESIZE_HERMITE;
      Jimp.RESIZE_BEZIER;
      */

      image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
        var src = `data:${"image/png"};base64,${Buffer.from( buffer ).toString('base64')}`

        //if( !guriWorks.data.friends[ userID ] ) guriWorks.data.friends[ userID ] = {}

     //   guriWorks.data.friends[ userID ].imageSRC = src
       // guriWorks.data.friends[ userID ].id = userID
      //  guriWorks.data.friends[ userID ].username = guriWorks.data.friendsList[userID].username

        resolve(src)

      });
    });

  });
}

guriWorks.friends.getAvatarMedium = async( userID, appendID ) => {

  var handle = await guriWorks.friends.getAvatar( "Medium", userID, appendID )  
  return handle
}

guriWorks.friends.getAvatarSmall = async( userID, appendID ) => {

  var handle = await guriWorks.friends.getAvatar( "Small", userID, appendID )  
  return handle
}

guriWorks.friends.getAvatarLarge = async( userID, appendID ) => {

  var handle = await guriWorks.friends.getAvatar( "Large", userID, appendID )  
  return handle
}

guriWorks.lobby = {}

guriWorks.lobby.getList = () => {  
  return new Promise((resolve, rejected) => {
    var resulta = greenworks.addRequestLobbyListDistanceFilter( greenworks.LobbyDistanceFilter["Close"] )
    var resultb = greenworks.requestLobbyList()
    var result = ""    

    setTimeout(function(){

      result = guriWorks.data.lobbies
      
     // guriWorks.append.lobbies()

      if(result){
        resolve({ok: "ok", message: result })
      }else{
        resolve({error: "error", message: result })
      } 

    }, 1500)   

  })
}
  
guriWorks.lobby.getTypesList = () => {  
  return new Promise((resolve, rejected) => {
    var result = greenworks.LobbyType
    if(result){
      resolve({ok: "ok", message: result })
    }else{
      resolve({error: "error", message: result })
    } 
  })
}

guriWorks.lobby.invite = (userID) => {
  
  if(guriWorks.data.lobby.enteredID){    
     greenworks.inviteUserToLobby( guriWorks.data.lobby.enteredID, userID )
  } 
  return "ok"
}

guriWorks.lobby.create = (type, maxUsers) => {  
  return new Promise((resolve, rejected) => {  

    
    var result = greenworks.createLobby(type, maxUsers)
    if(result){
      resolve({ok: "ok", message: result })
    }else{
      resolve({error: "error", message: result })
    } 
  })
}

guriWorks.lobby.leave = () => {  
  return new Promise((resolve, rejected) => {
    
    var lobbyEnteredID = guriWorks.data.lobby.enteredID 
            
    if(lobbyEnteredID){
      
      guriWorks.lobby.sendMessage( "UseRExiT" )
      
      guriWorks.data.lobby.enteredID = ""
      guriWorks.data.lobby.createdID = ""      
      guriWorks.data.users = {}

      setTimeout(function(){

        var result = greenworks.leaveLobby( lobbyEnteredID )
        result = "ok"
        if(result){
          resolve({ok: "ok", message: result })
        }else{
          resolve({error: "error", message: result })
        } 

      },1500)

    }   
    
  })
}

guriWorks.lobby.getOwner = ( lobbyID ) => {  // falta testar
  return new Promise((resolve, rejected) => {
    var result = greenworks.getLobbyOwner( lobbyID ) 
    if(result){
      resolve({ok: "ok", message: result })
    }else{
      resolve({error: "error", message: result })
    } 
  })
}

guriWorks.lobby.setOwner = ( lobbyID, userID ) => {  // falta testar
  return new Promise((resolve, rejected) => {
    var result = greenworks.setLobbyOwner( lobbyID, userID ) 
    if(result){
      resolve({ok: "ok", message: result })
    }else{
      resolve({error: "error", message: result })
    } 
  })
}

guriWorks.lobby.getMemberByIndex = ( lobbyID, index ) => {  // falta testar
  return new Promise((resolve, rejected) => {
    var result = greenworks.getLobbyMemberByIndex( lobbyID, index ).getPersonaName() 
    if(result){
      resolve({ok: "ok", message: result })
    }else{
      resolve({error: "error", message: result })
    } 
  })
}

guriWorks.lobby.setData = ( lobbyID, key, value ) => {  // falta testar
  return new Promise((resolve, rejected) => {
    var result = greenworks.setLobbyData( lobbyID, key, value )
    if(result){
      resolve({ok: "ok", message: result })
    }else{
      resolve({error: "error", message: result })
    } 
  })
} 

guriWorks.lobby.getData = ( lobbyID, key ) => {  // falta testar
  return new Promise((resolve, rejected) => {
    var result = greenworks.getLobbyData( lobbyID, key )
    if(result){
      resolve({ok: "ok", message: result })
    }else{
      resolve({error: "error", message: result })
    } 
  })
}

guriWorks.lobby.setMemberData = ( lobbyID, key, value ) => {   
  return new Promise((resolve, rejected) => {
    var result = greenworks.setLobbyMemberData( lobbyID, key, value )
    if(result){
      resolve({ok: "ok", message: result })
    }else{
      resolve({error: "error", message: result })
    } 
  })
} 

guriWorks.lobby.getMemberData = ( lobbyID, userID, key ) => {  
  return new Promise((resolve, rejected) => {
    var result = greenworks.getLobbyMemberData( lobbyID, userID, key )
    if(result){
      resolve({ok: "ok", message: result })
    }else{
      resolve({error: "error", message: result })
    } 
  })
} 


guriWorks.lobby.sendMessage = ( message ) => {  
  return new Promise((resolve, rejected) => {
    
    var myID = guriWorks.data.steamID.steamId
    var lobbyEnteredID = guriWorks.data.lobby.enteredID 

    if(lobbyEnteredID){

      var data = {
        steamID: myID,
        username: guriWorks.data.steamID.screenName,
        type: "chat",
        message: message
      }

      greenworks.setLobbyMemberData(lobbyEnteredID, "userData", JSON.stringify(data) )  
       resolve({ok: "ok", message: "ok" })
    } 
     
  })
} 

guriWorks.lobby.sendGameMessage = ( message ) => {  
  return new Promise((resolve, rejected) => {
    
    var myID = guriWorks.data.steamID.steamId
    var lobbyEnteredID = guriWorks.data.lobby.enteredID 

    if(lobbyEnteredID){

      var data = {
        steamID: myID,
        username: guriWorks.data.steamID.screenName,
        type: "game",
        message: message
      }

      greenworks.setLobbyMemberData(lobbyEnteredID, "userData", JSON.stringify(data) )  
       resolve({ok: "ok", message: "ok" })
    } 
     
  })
} 



guriWorks.lobby.join = (event) => {
  var id = event.target.id  
  console.log(event.target.id)
  // greenworks.joinLobby(id) 
}

guriWorks.use = {}

guriWorks.use.avatar = {}

guriWorks.use.avatar.getURL = async(userID) => {
  var url = `https://steamcommunity.com/profiles/${userID}/?xml=1`
  return fetch(url)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(xml => {
    return xml.getElementsByTagName("avatarMedium")[0].innerHTML.split("[")[2].split("]")[0]   
  })
} 

guriWorks.use.avatar.getSRC = async(userID) => {
  var imageURL = await guriWorks.use.avatar.getURL(userID)
  return fetch(imageURL)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  }))
} 
  
guriWorks.use.lobby = {}


guriWorks.use.lobby.usersUpdate = async() => {  

  guriWorks.data.lobby.users = await guriWorks.use.lobby.getLobbyMembers()
  
  for(let userID in guriWorks.data.lobby.removedUsers){
    delete guriWorks.data.lobby.users[ userID ]    
  }
  
  guriWorks.messages.usersListChanged()
}

//https://partner.steamgames.com/doc/api/ISteamMatchmaking#ELobbyType
guriWorks.use.lobby.create = () => {  
  guriWorks.data.lobby = {} //reset lobby data
  guriWorks.data.lobby.removedUsers = {}
  //Joinable by friends and invitees, but does not show up in the lobby list.
  guriWorks.lobby.create(1, 4)  
}

guriWorks.use.lobby.join = (lobbyID) => {   
  guriWorks.data.lobby = {}
  guriWorks.data.lobby.removedUsers = {}
  greenworks.joinLobby( lobbyID )
  guriWorks.data.lobby.enteredID = lobbyID
}

guriWorks.use.lobby.leave = (lobbyID) => {
  guriWorks.data.lobby = {}
  guriWorks.data.lobby.removedUsers = {}
  guriWorks.lobby.leave()
}

guriWorks.use.lobby.getNumLobbyMembers = () => {  
  return greenworks.getNumLobbyMembers(guriWorks.data.lobby.enteredID)
}

// verificar se modificou núemro de usuários na sala
guriWorks.use.lobby.changed = async() => {  
  
  var total = guriWorks.use.lobby.getNumLobbyMembers()
  
  if(!guriWorks.data.lobby.membersTotal){
    //eu entrei na sala
    guriWorks.messages.myUserEnter()
    
  }else if(guriWorks.data.lobby.membersTotal < total){
    //entrou usuário na sala
    //update users list
    guriWorks.messages.newUserExit()
    
  }else if(guriWorks.data.lobby.membersTotal > total){
    //saiu usuário na sala
    //update users list
    guriWorks.messages.newUserEnter()
  }
  
  guriWorks.data.lobby.membersTotal = total
}

guriWorks.use.lobby.getLobbyMembers = async () => { // quando entra na sala, precisa pegar os dados
  
  if(!guriWorks.data.lobby.enteredID) return 0
  
  var total = greenworks.getNumLobbyMembers( guriWorks.data.lobby.enteredID )
  
  var users = {}
  
  for(let i=0; i<total; i++){
    
    var user = greenworks.getLobbyMemberByIndex(guriWorks.data.lobby.enteredID, i)
    var username = user.getPersonaName()
    var steamID = user.getRawSteamID()
    
    users[steamID] ={
      name: username,
      steamID: steamID,
      imageSRC: await guriWorks.use.avatar.getSRC(steamID)
    }    
  }
 
  return users  
}


guriWorks.use.lobby.removeUser = async ( userID ) => { 
    
  guriWorks.messages.send( userID, "removeUser")   
}

guriWorks.events = () => {  
  
  log("events start")
  
 // guriWorks.append.friends()

  greenworks.on('game-overlay-activated', function(is_active) {
    if (is_active)
      log('game overlay is activated');
    else
      log('game overlay is deactivated');
  });

  greenworks.on('steam-servers-connected', function() { log('connected'); });
  greenworks.on('steam-servers-disconnected', function() { log('disconnected'); });
  greenworks.on('steam-server-connect-failure', function() { log('connected failure'); });
  greenworks.on('steam-shutdown', function() { log('shutdown'); });
    
  
 
  greenworks.on('game-connected-friend-chat-message', function(steam_id, message_id) { 
    log('game-connected-friend-chat-message'); 
    log( steam_id  ); //String: a 64-bits steam ID.
    log( message_id  ); //Integer
    // Emitted when a chat message has been received from a user.
  });
 

 
  greenworks.on('persona-state-change', function(steam_id, persona_change_flag) {
    if (persona_change_flag == greenworks.PersonaChange.Name){
      console.log("Change to new name: " + steam_id.getPersonaName());
    }  
  });
  

  greenworks.on('lobby-match-list', async function( ...args ) {
      log('lobby-match-list');     
     // console.log( m_nLobbiesMatching args[0] ); // total lobbies  
    
    guriWorks.data.lobbies = {}
    
    for(let index in args){
      
      var id = args[index]

      if(id.length > 15){ // isID

        var total = await greenworks.getNumLobbyMembers( id )
        var lname = await greenworks.getLobbyData( id, "name")
        var owner = await greenworks.getLobbyOwner( id )  

        guriWorks.data.lobbies[  id ] = { 
          totalUsers: total,
          name: lname,
          owner: owner
        }  
      }
    }   
    
  });
  
 
  greenworks.on('game-connected-friend-chat-message', function(steam_id, message_id) {
    message_id = message_id
    var info = greenworks.getFriendMessage(steam_id.getRawSteamID(), message_id, 2048);
    if (info.chatEntryType == greenworks.ChatEntryType.ChatMsg) {
      var message = info.message;
      console.log("Receive a message from " + steam_id.getPersonaName() + ": " +  message);
      //greenworks.replyToFriendMessage(steam_id.getRawSteamID(), "Hello, I received your message.");
    }
  }); 
  
 
  greenworks.on('rich-presence-join-requested', function(m_steamIdFriend, m_rgchConnect  ) { 
    log('rich-presence-join-requested'); 
    log( m_steamIdFriend  ); //String: the friend they joined through. This will be invalid if not directly via a friend.    
    log( m_rgchConnect   ); //String: The value associated with the "connect" Rich Presence key. 
  });
    
  
  greenworks.on('new-url-launch-parameters', function(buffer1, buffer2  ) { 
        
    log('new-url-launch-parameters'); 
    log( buffer1  );     
    log( buffer2   );  
  });
  
 
 
  greenworks.on('lobby-created', function(m_eResul, m_ulSteamIDLobby ) {  
    log('lobby-created'); 
   // log( m_eResul ); // Integer: lobby creation result.
   // log( m_ulSteamIDLobby ); //String: the Steam ID of the Lobby.
    
    guriWorks.data.lobby.createdID = m_ulSteamIDLobby
    guriWorks.data.lobby.creationResult = m_eResul
  });
 
 
  greenworks.on('lobby-enter',function(m_ulSteamIDLobby, m_rgfChatPermissions, 
                                         m_bLocked, m_EChatRoomEnterResponse  ) { 
    log('lobby-enter'); 
   // log( m_ulSteamIDLobby  );    // String: the Steam ID of the Lobby.
   // log( m_rgfChatPermissions  ); // Integer: unused - always 0.
   // log( m_bLocked   );  // Boolean: if true, then only invited users may join.
   // log( m_EChatRoomEnterResponse   ); //Integer: This is actually a EChatRoomEnterResponse value. This will be set to 
    //k_EChatRoomEnterResponseSuccess if the lobby was successfully joined, otherwise it will be k_EChatRoomEnterResponseError.   
    
    guriWorks.data.lobby.enteredID = m_ulSteamIDLobby
    guriWorks.data.lobby.isBlocked = m_bLocked
    guriWorks.data.lobby.response = m_EChatRoomEnterResponse
    
   // ROOM.exit() //before enter, exit
    
   // ROOM.join( m_ulSteamIDLobby )

   // DATA.room = m_ulSteamIDLobby

    // setTimeout(function(){
    //guriWorks.set.presence( guriWorks.data.lobby.enteredID )
           
   // var time = new Date().getTime()
   // var data = { enter: true, time: time }
 
  //  guriWorks.set.sendUpdate(data)

   // }, 2000)
    
    guriWorks.messages.lobbyEnter()
 
  }); 

 
  greenworks.on('lobby-invite', function(m_ulSteamIDUser, m_ulSteamIDLobby, m_ulGameID ) { 
    log('lobby-invite'); 
    log( m_ulSteamIDUser  ); //String: Steam ID of the person that sent the invite.
    log( m_ulSteamIDLobby   );  //String: Steam ID of the lobby we're invited to.   
    log( m_ulGameID   );  //String: Game ID of the lobby we're invited to.
     
  });
  
  
  greenworks.on('lobby-join-requested', function(m_steamIDLobby, m_steamIDFriend  ) { 
    log('lobby-join-requested'); 
    log( m_steamIDLobby  );   //String: the Steam ID of the lobby to connect to.  
    log( m_steamIDFriend   ); //String: the friend they joined through. This will be invalid if not directly via a friend. 
    
   // ROOM.data.invited = true
   // ROOM.data.room = m_steamIDLobby

    greenworks.joinLobby( m_steamIDLobby ); 

  });  


  window.messages = []
  
  greenworks.on('lobby-data-update', async function(m_ulSteamIDLobby, m_ulSteamIDMember, m_bSuccess ) { 
    
    log('lobby-data-update'); 

    if( !guriWorks.data.lobby.enteredID ) return 0
    if( guriWorks.data.lobby.enteredID != m_ulSteamIDLobby ) return 0 // outro lobby ou anterior
    

   // log( m_ulSteamIDLobby ); 
  //  log( m_ulSteamIDMember ); 
   // log( m_bSuccess ); 

    if( m_ulSteamIDLobby != m_ulSteamIDMember){
      guriWorks.messages.receive( m_ulSteamIDMember )
    }


  //  log( m_ulSteamIDLobby );  //String: the Steam ID of the Lobby.
  //  log( m_ulSteamIDMember ); //String: Steam ID of either the member whose data changed, or the room itself.
  //  log( m_bSuccess );   //Boolean: whatever the lobby data was successfully changed.
    
   // if(guriWorks.data.lobby.enteredID != m_ulSteamIDMember){

    //  guriWorks.set.update( m_ulSteamIDMember )   

  //  }else{ 

    //  ROOM.data.receiveUpdate( m_ulSteamIDMember, true )      
  //  }



      //var timeDiff = new Date( new Date().getTime() - window.lastTime ).getSeconds()

      
      /*
      guriWorks.get.setLastTime( m_ulSteamIDMember ) //avoid repeat messages
      log("passou aqui 1")

      var data = await guriWorks.get.lobbyUserData( m_ulSteamIDMember )  

      if( data.key ){
        
        log("ppp1")

        var id = data.key + "_" + m_ulSteamIDMember

        if( !messages.includes(id) ){
          
              log("ppp2")

          messages.push( id )

          guriWorks.set.update( data )
        }
      }
      */

      /*
      if( data.id && data.id != lastid || DATA.lastUserMessage != m_ulSteamIDMember){ 

        var id = data.id + "_" + m_ulSteamIDMember
        
        
        if(){
          
          
        }
        
        lastid = data.id
        
        DATA.lastUserMessage = m_ulSteamIDMember

        log("passou aqui 2")

        guriWorks.set.update( m_ulSteamIDMember )
      }     
      */
   
  })
  
}

guriWorks.messages = {}

guriWorks.messages.personal = async( object, owner ) => {

  if(object.type == "exit" && object.message == "exit" && owner == guriWorks.data.user.id ){ // sou owner

    guriWorks.use.lobby.removeUser( object.id )  // quem enviou mensagem remove

  }else if(object.type == "ownerVerify" && owner == guriWorks.data.user.id ){ // sou owner

    guriWorks.messages.verifyOnlineUsers( object.message )

  }else if(object.message == "verify" && object.type == "verify" && owner == object.id ){ //   enviada pelo owner
    // solicitou verificação se estou online

    log("perguntou se estou online. enviei resposta direta")
    guriWorks.messages.send( "online", "verify", object.id )  

  }else if(object.message == "online" && object.type == "verify" ){

    log("recebi resposta do verify")
    guriWorks.data.onlineUsers[object.id] = "online" // set user online      
    log( guriWorks.data.onlineUsers )
 
  }        
}
 

guriWorks.messages.public = async( object, owner ) => {
  
  

  if( object.type == "removeUser" && owner != object.id ){


  }else if( object.type == "removeUser" && owner == object.id ){ // can only owner remove

    guriWorks.data.lobby.removedUsers[ object.message ] = true
    guriWorks.use.lobby.usersUpdate()
    log("removed userID: " +object.message)
    guriWorks.messages.newUserExit( object.message )

  }else if(object.message == "enter" && object.type == "enter" ){ // can all users add new user

    if( guriWorks.data.lobby.removedUsers[ object.id ] ){ // remove from list
      delete guriWorks.data.lobby.removedUsers[ object.id ]
    }

    guriWorks.use.lobby.usersUpdate()

    if(guriWorks.data.user.id == object.id){
      guriWorks.messages.myUserEnter()
    }else{
      guriWorks.messages.newUserEnter( object.id )  
    }      

  }else{ 

    if( object.type == "chat"){
      
      var date = new Date( object.date )    
      var loc = date.toLocaleString('pt-br')

      UI.chat(`${loc} | ${object.username} | ${object.message}`)

    }
    
    log( object ) 

  } 
}

// sempre recebo mensagem, verifico se numero de usuários diminuiu
// se diminuiu, usuário saiu da sala 
guriWorks.messages.receive = async( userID ) => {
  if(!guriWorks.data.lobby.enteredID) return 0

  log("recebeu algo")

  var message = greenworks.getLobbyMemberData( guriWorks.data.lobby.enteredID, userID, userID )
  var object = JSON.parse( message )
  object.id = userID // impedir mandar mensagem como se fosse outro jogador


  if( guriWorks.data.lobby.removedUsers[ object.id ] && object.type != "enter" ){ // Usuário removido. Não pode mais enviar mensagem
    return 0
  }     

  var owner = greenworks.getLobbyOwner( guriWorks.data.lobby.enteredID )
  // apenas owner pode remover usuario

  if(object.to == guriWorks.data.user.id){ // mensagem apenas para mim 

    guriWorks.messages.personal(object, owner) 


  }else if(object.to == 0){ 

    guriWorks.messages.public(object, owner)    

  } 

}  

guriWorks.messages.lobbyEnter = () => {  

  guriWorks.messages.send( "enter", "enter" ) 
}


guriWorks.messages.nextPlayer = ( userID ) => {  

  log("next player")

}

guriWorks.messages.tryNextNextPlayer = ( userID ) => {  

  log("is offline, tryNextNextPlayer")
  // preciso pegar o próximo usuário da lista, se estiver online, ativar a vez dele
  // senão, verificar novamente

}

// verifyOnlineUsers é igual sinônimo de next player
// antes passar a vez verifica se user is online
guriWorks.messages.verifyOnlineUsers = async(userID) => {  
  
  if( !guriWorks.data.lobby.users[ userID ] ){
    // usuario não existe na lista
    log("usuário não existe")
    return 0
  }

  var owner = greenworks.getLobbyOwner( guriWorks.data.lobby.enteredID )

  // sou dono do lobby
  if( owner == guriWorks.data.user.id ){

    guriWorks.messages.send( "verify", "verify", userID )

    setTimeout(function(){

      if( guriWorks.data.onlineUsers[userID] != "online"){

        log("usuário offline")
        guriWorks.use.lobby.removeUser( userID )

        guriWorks.messages.tryNextNextPlayer(userID)

      }else{
        guriWorks.messages.nextPlayer(userID)
      }


    }, 2000) 

  }else{ //não sou dono, pedir para o dono verificar se usuário está online

    guriWorks.messages.send( userID, "ownerVerify", owner)

  }  

}

guriWorks.messages.send = ( message, type, to ) => {  

  if(!guriWorks.data.lobby.enteredID) return 0

  if(!type) return 0 

  if(message == "verify" && type == "verify"){
    guriWorks.data.onlineUsers = {}
    guriWorks.data.onlineUsersVerify = 0
  }

  var message = {
    date: new Date().getTime(),
    to: to || 0,
    message: message,
    id: guriWorks.data.user.id,
    username: guriWorks.data.user.username,
    type: type
  } 

  greenworks.setLobbyMemberData( guriWorks.data.lobby.enteredID, guriWorks.data.user.id, JSON.stringify( message ) )
}

 

guriWorks.messages.usersListChanged = () => {  
  log("usersListChanged")  
  
  var users = ""
  
  if(guriWorks.data.lobby.users){
    
    for(let index in guriWorks.data.lobby.users){
      
      var username = guriWorks.data.lobby.users[index].name
      var id = guriWorks.data.lobby.users[index].steamID
      
      users+= `${username} + ${id} \n`
    }
    
    get("#usersInsideRoom").value = users
    
  }
}


guriWorks.messages.myUserEnter = async() => {  
  log("entrei na sala")
  // guriWorks.data.lobby.membersList = await guriWorks.use.lobby.getLobbyMembers()  
  
  UI.setInput( "roomEntered", guriWorks.data.lobby.enteredID )
  
  UI.log("entrei na sala")
 
   
} 

guriWorks.messages.newUserEnter = (userID) => { 
  log("novo usuário entrou na sala: "+ userID)

  UI.log("novo usuário entrou na sala: "+ userID)

}

guriWorks.messages.newUserExit = (userID) => {  
  log("novo usuário saiu da sala: "+ userID)
  UI.log("novo usuário saiu da sala: "+ userID)
}

guriWorks.start = async() => {  

  if(!greenworks) {
    log('Greenworks not support for ' + os.platform() + ' platform');
  }else{ 
    //if(!greenworks.initialize()) {
    if(!greenworks.init()) {
      log('Error on initializing steam API.');
    }else {
      log('Steam API initialized successfully.');  

      guriWorks.data.steamID = greenworks.getSteamId() // my data

      guriWorks.data.user = {
        id: guriWorks.data.steamID.steamId,
        username: guriWorks.data.steamID.screenName,    
        imageSRC: await guriWorks.use.avatar.getSRC( guriWorks.data.steamID.steamId )
      }

      guriWorks.data.friendsList = guriWorks.friends.getData()

      // get avatars

      for( let index in guriWorks.data.friendsList ){

        guriWorks.data.friendsList[index].imageSRC = await guriWorks.friends.getAvatar( "Medium", index )

      }

      //  guriWorks.data.steamID.avatarSRC = await guriWorks.friends.getAvatar( "Medium", guriWorks.data.steamID.steamId )

      // greenworks.removeAllListeners()

      //  guriWorks.events() 

      guriWorks.events()

    }
  }

  // guriWorks.get.setLastTime()
}

guriWorks.start()

var click_icon_x = () => {
  
  log("click_icon_x")
}

var fullscreen = false;
var elem = document.documentElement;
var dragMe = document.querySelector('.dragMe')
var menuBar = document.querySelector('.menuBar')

/* View in fullscreen */
var openFullscreen = () => {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }  

  dragMe.classList.remove("drag")
  dragMe.classList.add("no-drag")
  
  menuBar.classList.add("hide")
  menuBar.classList.remove("show")
}

/* Close fullscreen */
var closeFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }

  dragMe.classList.remove("no-drag")
  dragMe.classList.add("drag")

  menuBar.classList.remove("hide")
  menuBar.classList.add("show")
}

var click_icon_fullscreen = () => {
  
  if(fullscreen){
    closeFullscreen()
  }else{
    openFullscreen()
  }  
  
  fullscreen = !fullscreen
}

var click_icon_x = () => {
  
  if( window.confirm("Do you really want to leave?") ) {

    if(guriWorks.data.lobby.enteredID){
      var owner = greenworks.getLobbyOwner( guriWorks.data.lobby.enteredID )
      guriWorks.messages.send( "exit", "exit", owner )
    }

    setTimeout(function(){  
      // require('child_process').exec('taskkill /IM "sfml-audio.exe" /T /F')  
      process.kill( require('process').pid )
      nw.App.quit()
    },1000)  

  }
}

var win = nw.Window.get()

win.on('close', function(){
  
  if(guriWorks.data.lobby.enteredID){
    var owner = greenworks.getLobbyOwner( guriWorks.data.lobby.enteredID )
    guriWorks.messages.send( "exit", "exit", owner )
  }

  setTimeout(function(){  
    // require('child_process').exec('taskkill /IM "sfml-audio.exe" /T /F')  
    process.kill( require('process').pid )
    nw.App.quit()
  },1000) 

});

function inputUserID(){
  return get("#inputUserID").value
}

function inputRoomID(){
  return get("#inputRoomID").value
}

function getInputMessage(){
  return get("#inputMessage").value
}

function roomEntered(){
  return get("#roomEntered").value
}

var UI = {}

UI.setInput = ( id, value ) => {
  get( "#"+ id ).value = value
}

UI.log = ( message ) => {
  get("#roomLogs").value += `${message}\n`
}

UI.chat = ( message ) => {
  get("#receivedMessages").value += `${message}\n`
}

 

function enter(){
  log("enter")
  var id = inputRoomID()
  guriWorks.use.lobby.join( id )
}

function create(){
  log("create")
  guriWorks.use.lobby.create()
}

function exit(){
  log("exit")
   var owner = greenworks.getLobbyOwner( guriWorks.data.lobby.enteredID )
   
  if(guriWorks.data.lobby.enteredID){
    guriWorks.messages.send( "exit", "exit", owner )
  }

  guriWorks.use.lobby.leave()
  get("#roomEntered").value = ""
}

function sendMessage(){
  log("sendMessage")
  var message = getInputMessage()
  guriWorks.messages.send( message, "chat" )
}
 
function verify(){
  log("verify click")
  var id = inputUserID()
  guriWorks.messages.verifyOnlineUsers( id )
}


 /*
window.addEventListener('beforeunload', function() {

  guriWorks.messages.send( "exit", "chat" )
  
}, false);
*/