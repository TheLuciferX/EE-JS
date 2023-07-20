var div = document.createElement('div');
            $(div).css("height", "fitContent");
            $(div).css("width", "fitContent");
            $(div).css("display", "inline");
            document.body.appendChild(div);
            var par = document.createElement('p');
            $(par).css("margin", "0");
            $(par).text(pack.name);
            document.body.appendChild(par);
            div.appendChild(par);
            var allBlocks = pack.items;
            for(var j = 0; j < allBlocks.length; j++) {
                var img = document.createElement('img');
                $(img).css("height", "16px");
                $(img).css("width", "16px");
                var block = allBlocks[j];
                var bid = block.id;
                var src = Config.getClippedRegion(Config.BLOCKS, 16*bid, 0, 16, 16).toDataURL();
                $(img).attr("src", src);
                document.body.appendChild(img);
                div.appendChild(img);
            }
            blockPicker[0].appendChild(div);