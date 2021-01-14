try:
    import sys
    import urllib.request
    import urllib.parse
    import os
    import json
except BaseException as e:
    print("Initialization:", str(e))
    sys.exit(1)

class packet:
    cookie = ''

    def post(url, data = {}):
        headers={
            # "Accept": "application/json, text/javascript, */*; q=0.01",
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Host": "aq.fhmooc.com",
            "Origin": "http://aq.fhmooc.com",
            'Referer': 'http://aq.fhmooc.com/',
            'Cookie': packet.cookie,
        }


        datas=urllib.parse.urlencode(data).encode('utf-8')
        request = urllib.request.Request(url=url,data=datas,headers=headers)
        response = urllib.request.urlopen(request)
        return response.read().decode('utf8')
        

    # set cookie (认证信息)
    def setCookie(self, cookie):
        packet.cookie = cookie

    # 获取模块列表
    def getModuleList(self):
        #return packet.post("http://aq.fhmooc.com/api/portal/CellManager/getModuleList")
        return json.loads(packet.post("http://aq.fhmooc.com/api/portal/CellManager/getModuleList"))['list']

    # 获取模块信息(废弃)
    def getModuleInfo(self, moduleId):
        return packet.post("http://aq.fhmooc.com/api/portal/CourseIndex/getModuleInfo", {'moduleId': moduleId})

    # 获取模块信息(包括其他信息)
    def getBookModuleInfo(self, moduleId):
        #return packet.post("http://aq.fhmooc.com/api/portal/CourseIndex/getBookModuleInfo", {'moduleId': moduleId})
        return json.loads(packet.post("http://aq.fhmooc.com/api/portal/CourseIndex/getBookModuleInfo", {'moduleId': moduleId}))['topicList']

    # 保存进度
    def statStuProcessCellLogAndTimeLong(self, courseId, moduleIds, cellId, auvideoLength, videoTimeTotalLong):
        return packet.post("http://aq.fhmooc.com/api/design/LearnCourse/statStuProcessCellLogAndTimeLong", {'courseId': courseId, 'moduleIds': moduleIds, 'cellId': cellId, 'auvideoLength': auvideoLength, 'videoTimeTotalLong': videoTimeTotalLong})
