class DateTime {

    constructor(){
    }

    getTime(dt, format, sep){

        // overloading is done like this
        // defaults make it possible to call this method with 0, 1, 2 or 3 params
        if(typeof dt==='undefined')dt=new Date()
        if(typeof format==='undefined')format='h,m,s'
        if(typeof sep==='undefined')sep=':'

        let parts = format.split(",")
        let value = []

        if(parts.length!==0){
            parts.forEach(x => {
                switch(x.toUpperCase()){
                    case 'H':
                        value.push(`${String(dt.getHours()).padStart(2, '0')}`)
                        break;
                    case 'M':
                        value.push(`${String(dt.getMinutes()).padStart(2, '0')}`)                               
                        break;
                    case 'S':
                        value.push(`${String(dt.getSeconds()).padStart(2, '0')}`)
                        break;
                    case 'MS':
                        value.push(`${String(dt.getMilliseconds()).padStart(3, '0')}`)                                                
                        break;
                }
            })
        }
        return value.join(sep)
    }

    getDate(dt, format, sep){
        
        // overloading is done like this
        // defaults make it possible to call this method with 0, 1, 2 or 3 params
        if(typeof dt==='undefined')dt=new Date()
        if(typeof format==='undefined')format='y,m,d'
        if(typeof sep==='undefined')sep='-'

        let parts = format.split(",")
        let value = []

        if(parts.length!==0){
            parts.forEach(x => {
                switch(x.toUpperCase()){
                    case 'Y':
                        value.push(this.getYear(dt))
                        break;
                    case 'M':
                        value.push(this.getMonth(dt))                               
                        break;
                    case 'D':
                        value.push(this.getDayOfMonth(dt))
                        break;
                }
            })
        }
        return value.join(sep)
    }

    getYear(dt){
        if(typeof dt==='undefined')dt=new Date()            
        return dt.getFullYear().toString()
    }

    getMonth(dt, padded){
        
        if(typeof dt==='undefined')dt=new Date()       
        if(typeof padded==='undefined')padded=true 

        if(padded) return String(dt.getMonth()+1).padStart(2, '0')
        return String(dt.getMonth()+1)    
    }

    getDayOfMonth(dt, padded){
        
        if(typeof dt==='undefined')dt=new Date()       
        if(typeof padded==='undefined')padded=true       

        if(padded) return String(dt.getDate()).padStart(2, '0')
        return String(getDate())    
    
    }
    
    getEpoch(){
        return Date.now()
    }
}

module.exports = DateTime
