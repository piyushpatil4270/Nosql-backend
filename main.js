function swap(arr,i,j){
    let temp=arr[i]
    arr[i]=arr[j]
    arr[j]=temp
}

function sort(arr){
    for(let i=0;i<arr.length;i++){
        let mini=i;
        for(let j=i;j<arr.length;j++){
            if(arr[j]<arr[mini])mini=j;
        }
        swap(arr,i,mini)
    }
}

const a1=[2,1,5,4,2,1,5,3,6,8,55,45,3,89,1,10]


const a2=[]
for(let i=0;i<a1.length;i++){
    if(!a2.includes(a1[i]))a2.push(a1[i])
}
console.log(a2)
sort(a2)
console.log(a2)