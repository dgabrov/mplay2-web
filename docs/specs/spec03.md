@src/service/mock_service.ts

- create two maps, one {[key:string] : Media[]} and one {[key: string]: PlayList[]}
- the key is user_id that you populate from the test data at line 6
- you generate nice test data for each, 20 items for each user, various names
- you implement functions searchMedia and searchPlayLists to look in description for media and playlisst respectively