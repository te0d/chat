require 'rubygems'
require 'em-websocket'
require 'cinch'

# clean this shit up
EM.run {
  EM::WebSocket.run(:host => "0.0.0.0", :port => 8081) do |ws|
    bot = Cinch::Bot.new do
      configure do |c|
        c.server = "irc.todonnell.us"
        c.channels = ["#chat"]
      end

      on :message, /(.+)/ do |msg, text|
        ws.send "#{msg.user.name}: #{text}"
      end
    end

    ws.onopen do |handshake|
      puts "Connection opened."
      ws.send "Ay yo, y'all be connectin to #{handshake.path}"
    end

    ws.onclose { puts "Connection closed." }

    # when receiving a message from a client, forward to irc
    ws.onmessage do |msg|
      puts "ya herd: #{msg}"
      bot.channel_list.find_ensured('#chat').send(msg)
      ws.send  "#{bot.config.nick}: #{msg}"
    end

    Thread.new { bot.start }
  end
}
