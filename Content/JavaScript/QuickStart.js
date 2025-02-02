"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UE = require("ue");
const puerts_1 = require("puerts");
let obj = new UE.MainObject();
//成员访问
console.log("----------------------------------------------------");
console.log("before set", obj.MyString);
obj.MyString = "PPPPP";
console.log("after set", obj.MyString);
//简单类型参数函数
console.log("----------------------------------------------------");
let sum = obj.Add(100, 300);
console.log('sum', sum);
//复杂类型参数函数
console.log("----------------------------------------------------");
obj.Bar(new UE.Vector(1, 2, 3));
//引用类型参数函数
console.log("----------------------------------------------------");
let vectorRef = puerts_1.$ref(new UE.Vector(1, 2, 3));
obj.Bar2(vectorRef);
obj.Bar(puerts_1.$unref(vectorRef));
//静态方法
console.log("----------------------------------------------------");
let str1 = UE.JSBlueprintFunctionLibrary.GetName();
let str2 = UE.JSBlueprintFunctionLibrary.Concat(', ', str1);
UE.JSBlueprintFunctionLibrary.Hello(str2);
//扩展方法，和C#的扩展方法类似
console.log("----------------------------------------------------");
let v = new UE.Vector(3, 2, 1);
console.log(v.ToString());
v.Set(8, 88, 888);
console.log(v.ToString());
//静态wrap
console.log("----------------------------------------------------");
let vec = new UE.Vector(1, 2, 3);
console.log('vec', vec.ToString());
vec.X = 3;
vec.Y = 2;
vec.Z = 1;
vec.Normalize(1);
console.log('vec', vec.ToString());
console.log(vec.Projection().ToString());
console.log('vec', vec.ToString());
//枚举
console.log("----------------------------------------------------");
obj.EnumTest(UE.EToTest.V1);
obj.EnumTest(UE.EToTest.V13);
//定长数组
console.log("----------------------------------------------------");
console.log("MyFixSizeArray.Num()", obj.MyFixSizeArray.Num());
console.log("MyFixSizeArray[32]", obj.MyFixSizeArray.Get(32));
console.log("MyFixSizeArray[33]", obj.MyFixSizeArray.Get(33));
console.log("MyFixSizeArray[34]", obj.MyFixSizeArray.Get(34));
obj.MyFixSizeArray.Set(33, 1000);
console.log("MyFixSizeArray[32]", obj.MyFixSizeArray.Get(32));
console.log("MyFixSizeArray[33]", obj.MyFixSizeArray.Get(33));
console.log("MyFixSizeArray[34]", obj.MyFixSizeArray.Get(34));
//TArray
console.log("----------------------------------------------------");
function printTArray(arr) {
    console.log("-----Num:", arr.Num());
    for (var i = 0; i < arr.Num(); i++) {
        console.log(i, ":", arr.Get(i));
    }
}
printTArray(obj.MyArray);
obj.MyArray.Add(888);
obj.MyArray.Set(0, 7);
printTArray(obj.MyArray);
//TSet
console.log("----------------------------------------------------");
console.log(obj.MySet.Num());
console.log(obj.MySet.Contains("John"));
console.log(obj.MySet.Contains("Che"));
console.log(obj.MySet.Contains("Hello"));
//TMap
console.log("----------------------------------------------------");
console.log(obj.MyMap.Get("John"));
console.log(obj.MyMap.Get("Che"));
console.log(obj.MyMap.Get("Hello"));
obj.MyMap.Add("Che", 10);
console.log(obj.MyMap.Get("Che"));
//ArrayBuffer
console.log("----------------------------------------------------");
let ab = obj.ArrayBuffer;
let u8a1 = new Uint8Array(ab);
for (var i = 0; i < u8a1.length; i++) {
    console.log(i, u8a1[i]);
}
obj.ArrayBufferTest(ab);
obj.ArrayBufferTest(new Uint8Array(ab));
let ab2 = obj.ArrayBufferTest(new Uint8Array(ab, 5));
let u8a2 = new Uint8Array(ab2);
console.log(u8a2.length);
for (var i = 0; i < u8a2.length; i++) {
    console.log(i, u8a2[i]);
}
//引擎方法
console.log("----------------------------------------------------");
//在FJsEnv启动，调用Start时传入的参数可以通过argv获取
let world = puerts_1.argv.getByName("GameInstance").GetWorld();
let actor = world.SpawnActor(UE.MainActor.StaticClass(), undefined, UE.ESpawnActorCollisionHandlingMethod.Undefined, undefined, undefined);
console.log(actor.GetName());
console.log(actor.K2_GetActorLocation().ToString());
//蓝图加载
let bpClass = UE.Class.Load('/Game/StarterContent/TestBlueprint.TestBlueprint_C');
let bpActor = world.SpawnActor(bpClass, undefined, UE.ESpawnActorCollisionHandlingMethod.Undefined, undefined, undefined);
bpActor.Foo(false, 8000, 9000);
//Delegate
console.log("----------------------------------------------------");
function MutiCast1(i) {
    console.warn("MutiCast1<<<", i);
}
function MutiCast2(i) {
    console.warn("MutiCast2>>>", i);
    actor.NotifyWithInt.Remove(MutiCast2); //调用一次后就停掉
}
actor.NotifyWithInt.Add(MutiCast1);
actor.NotifyWithInt.Add(MutiCast2);
console.log("NotifyWithString.IsBound", actor.NotifyWithString.IsBound());
console.log("NotifyWithRefString.IsBound", actor.NotifyWithRefString.IsBound());
actor.NotifyWithRefString.Bind((strRef) => {
    //console.error("NotifyWithRefString");
    console.log("NotifyWithRefString", puerts_1.$unref(strRef));
    puerts_1.$set(strRef, "out to NotifyWithRefString"); //引用参数输出
});
console.log("NotifyWithString.IsBound", actor.NotifyWithString.IsBound());
console.log("NotifyWithRefString.IsBound", actor.NotifyWithRefString.IsBound());
actor.NotifyWithStringRet.Bind((inStr) => {
    return "////" + inStr;
});
actor.NotifyWithInt.Broadcast(888999);
let strRef = puerts_1.$ref("666");
actor.NotifyWithRefString.Execute(strRef);
console.log("out str:" + puerts_1.$unref(strRef));
let retStr = actor.NotifyWithStringRet.Execute("console.log('hello world')");
console.log("ret str:" + retStr);
console.log("waiting native call script...........");
/*
//用React来写UI
ReactUMG.init(world);
UI.Load();
*/
//JS继承一个原生类
class MyActor extends UE.Actor {
    //注意，继承UE类的js类，构造函数必须大写开头
    Constructor() {
        this.PrimaryActorTick.bCanEverTick = true;
        console.log("this.Add", this.Add(33, 44));
        this.tickCount = 0;
    }
    //override 1
    ReceiveBeginPlay() {
        console.log("ReceiveBeginPlay");
        console.log("this.Add", this.Add(55, 66));
    }
    Add(a, b) {
        return a + b;
    }
    //override 2
    ReceiveTick(DeltaSeconds) {
        if (this.tickCount % 100 == 0 && this.tickCount <= 200) {
            console.log("MyActor.ReceiveTick", DeltaSeconds, this.tickCount);
        }
        ++this.tickCount;
    }
}
let cls = puerts_1.makeUClass(MyActor);
let actor2 = world.SpawnActor(cls, undefined, UE.ESpawnActorCollisionHandlingMethod.Undefined, undefined, undefined);
//JS继承一个蓝图类
//!！注意：blueprint<xxx>会导致这个BP类常驻内存
const TestBlueprint = puerts_1.blueprint('/Game/StarterContent/TestBlueprint.TestBlueprint_C');
class MyBPActor extends TestBlueprint {
    //覆盖蓝图提供的方法，此时无论是蓝图在BeginPlay的调用，以及在ts侧的调用，都会用这个新的实现
    Foo(P1, P2, P3) {
        console.log(">>>>>>>>>>>>>>>>>>>>", P1 ? P2 : P3);
    }
}
let clsBP = puerts_1.makeUClass(MyBPActor);
let bpActor2 = world.SpawnActor(clsBP, undefined, UE.ESpawnActorCollisionHandlingMethod.Undefined, undefined, undefined);
bpActor2.Foo(false, 8000, 9000);
//unhandledRejection
puerts_1.on('unhandledRejection', function (reason) {
    console.log('unhandledRejection~~~', reason.stack);
});
new Promise(() => {
    throw new Error('unhandled rejection');
});
//# sourceMappingURL=QuickStart.js.map