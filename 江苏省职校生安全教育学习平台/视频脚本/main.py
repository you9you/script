from packet import packet
p = packet()
#####################################################
# 网页登录后的cookie
# 无法从document.cookie获取(httpOnly)
# 仅需auth字段

auth = ''

#####################################################
p.setCookie('auth=' + auth)
moduleList = p.getModuleList()

for module in moduleList:
    try:
        moduleId = module['id']
        infoList = p.getBookModuleInfo(moduleId=moduleId)
        for info in infoList:
            try:
                cells = info['cells']
                for cell in cells:
                    try:
                        courseId = cell['CourseId']
                        moduleIds = moduleId
                        cellId = cell['Id']
                        auvideoLength = cell['VideoTimeLong']
                        videoTimeTotalLong = cell['VideoTimeLong']
                        print(p.statStuProcessCellLogAndTimeLong(courseId=courseId,moduleIds=moduleIds,cellId=cellId,auvideoLength=auvideoLength,videoTimeTotalLong=videoTimeTotalLong))
                        
                    except Exception as e:
                        print("cells:", str(e))
            except Exception as e:
                print("infoList:", str(e))
                
    except BaseException as e:
        print("Network:", str(e))
    except Exception as e:
        print("moduleList:", str(e))
    


print('\n\nFinished')
