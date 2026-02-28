import { Directive, ElementRef, HostListener } from "@angular/core";



@Directive({
    selector:'[apphighlighter]'
})


export class AppHighlighter{
   constructor(private el: ElementRef){
   
   }

   @HostListener('mouseenter') onMousEnter(){
       this.el.nativeElement.style.BackgroundColor = 'red'
   }

   @HostListener('mouseleave') onMouseLEave(){
      this.el.nativeElement.stlye.BackgroundColor = 'white'
   }
}