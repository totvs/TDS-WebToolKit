import React from "react";
import { TdsPage } from "../components/page/page";
import "./demoPage.css"

export function DemoPage(): any {
    return (
        <React.StrictMode>
            <TdsPage title="TdsPage: Demo" showFooter={true}>
                <p>Área com elementos que compõem a página. Essa região é rolável.</p>
                <p>Ajuste largura e margens usando CSS:<br />
                    <code>
                        .tds-page {`{
                      width: 85%;
                      margin-left: auto;
                      margin-right: auto;
                    }`}
                    </code>
                </p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque justo sapien, venenatis sit amet erat sit amet, egestas dapibus erat. Phasellus vitae diam vitae nibh malesuada ullamcorper eu non purus. Duis porttitor, nibh vel ullamcorper faucibus, nibh nisi hendrerit libero, quis finibus erat arcu nec nisi. Nulla molestie, libero nec consectetur scelerisque, est tellus vulputate urna, in interdum ipsum erat nec ipsum. Proin venenatis posuere finibus. Praesent pretium malesuada sagittis. Mauris nisi purus, porttitor at volutpat sit amet, venenatis a turpis. Nullam molestie justo quis elit dignissim, nec faucibus orci sollicitudin. Vivamus euismod tortor vitae vulputate sodales. Suspendisse potenti. Aenean at dolor sem. Maecenas bibendum id dolor ac condimentum. Sed interdum, tellus posuere bibendum molestie, neque neque vehicula lectus, sed tincidunt magna turpis sed dolor. Aliquam et lacus nec felis efficitur bibendum. Mauris id enim purus. Donec porttitor mi luctus leo imperdiet molestie.</p>
                <p>In dignissim, sem et suscipit accumsan, orci massa ullamcorper leo, non bibendum ex nulla sed arcu. Pellentesque et sem id justo tempor pharetra dignissim eu diam. Quisque vitae leo ante. Duis vehicula purus rhoncus, commodo nisl non, auctor magna. Nullam non odio quam. Cras cursus risus lobortis, rutrum ipsum at, feugiat tellus. In tempor volutpat diam, sit amet hendrerit lectus pretium in. Ut a porttitor mauris. Aenean varius erat non fermentum egestas. Fusce semper mollis urna, tincidunt feugiat turpis vulputate ultricies. Donec vel ex iaculis, tempor libero eget, lacinia leo. Nulla accumsan mauris ut tincidunt convallis. Proin non ultrices risus. Sed quis blandit mi.</p>
                <p>Vestibulum aliquam egestas lectus in pretium. Mauris suscipit enim vel nunc aliquam lacinia. Ut sit amet magna ac lorem sodales pharetra sit amet eu enim. Nulla lacus purus, faucibus nec felis sed, pretium scelerisque justo. Etiam efficitur neque ex, nec ultricies justo tempus in. Nam non tortor ultrices, blandit libero id, pellentesque leo. Praesent ornare luctus ligula in laoreet. Duis vitae justo in ipsum blandit vulputate. Quisque pretium ligula ac egestas fringilla. Suspendisse potenti. Sed cursus commodo quam, eget rutrum mi dapibus vel. Nullam nec ullamcorper neque, finibus accumsan libero. Fusce facilisis orci et purus pulvinar elementum. Integer sed congue ligula. Fusce dui sem, finibus at lorem ac, volutpat auctor nisi.</p>
                <p>Donec sodales sem sit amet nibh dictum tincidunt. Etiam semper mattis purus et convallis. Proin sed lectus bibendum, maximus orci nec, efficitur mi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed sit amet dictum eros. Ut vel laoreet libero. Duis id pulvinar neque. Vivamus mollis lorem imperdiet felis sagittis, nec eleifend felis scelerisque. Ut leo libero, scelerisque in auctor vitae, imperdiet nec arcu. Quisque congue egestas consectetur. Cras ornare nisi in ligula sodales, id rutrum eros tincidunt. Donec lobortis ullamcorper justo ut ultricies. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Ut eget neque bibendum, vulputate tellus eget, viverra nulla. Vestibulum laoreet tellus nec dolor tempor, vitae pulvinar nisl venenatis.</p>
                <p>In a euismod odio. Mauris at leo felis. Aenean ac aliquet metus. Cras facilisis luctus ex, nec pretium felis egestas in. Nunc quis consectetur sem, ullamcorper ullamcorper est. Nulla ac est quis diam mollis fermentum eu ut dui. Fusce purus velit, rhoncus lacinia tincidunt sit amet, maximus eu magna.</p>
            </TdsPage>
        </React.StrictMode>
    )
}
