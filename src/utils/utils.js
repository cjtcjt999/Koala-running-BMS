export default {
    formateDate(time){
        if(!time)return '';
        let date = new Date(time);
        return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
    },
    pagination(data,callback){
      return {
        onChange:(current)=>{
          callback(current);
        },
        current: Number(data.data.currentPage),
        pageSize: data.data.pageSize,
        total: data.data.total,
        showTotal:()=>{
          return `共${data.data.total}条`
        },
        showQuickJumper:true
      }
    }
}