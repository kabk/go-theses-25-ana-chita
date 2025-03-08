-- tufte-handout.lua
function Para(elem)
    if elem.content[1] and elem.content[1].t == "Str" and elem.content[1].text:match("^Side%a+:") then
      local label = elem.content[1].text:match("^Side%a+:")
      table.remove(elem.content, 1)
      return pandoc.RawBlock('html', string.format('<span class="marginnote spacing">%s</span>', pandoc.utils.stringify(elem)))
    end
  end
  
  function Table(tab)
    if tab.caption and #tab.caption > 0 and tab.caption[1].content and #tab.caption[1].content > 0 and tab.caption[1].content[1].text:match("^SideTable:") then
      local caption = tab.caption[1].content
      table.remove(caption, 1)
      local html = pandoc.write(pandoc.Pandoc({tab}), 'html')
      return pandoc.RawBlock('html', string.format('<span class="marginnote spacing">%s%s</span>', pandoc.utils.stringify(caption), html))
    end
  end
  
  function BulletList(list)
    if #list.content > 0 and #list.content[1] > 0 and #list.content[1][1].content > 0 and list.content[1][1].content[1].text:match("^SideList:") then
      local label = list.content[1][1].content[1].text:match("^SideList:")
      table.remove(list.content[1][1].content, 1)
      local html = pandoc.write(pandoc.Pandoc({list}), 'html')
      return pandoc.RawBlock('html', string.format('<span class="marginnote spacing">%s%s</span>', label, html))
    end
  end