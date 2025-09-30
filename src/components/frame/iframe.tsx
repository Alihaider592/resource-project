import Cmap from "./frameCards/cmap/cmap"
export default function Frame() {
    return(
        <div className="mt-10">
            <div>
                <p className="mb-5 text-2xl font-bold">See How Our Clients Drive Impact ?</p>
            </div>
            <div className="flex gap-40">
          <iframe className="rounded-3xl"  width="560"  height="315"  src="https://www.youtube.com/embed/bz21zTQ_LWs?si=T74ZQC7-H643SYln"  title="YouTube video player"   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"   referrerPolicy="strict-origin-when-cross-origin"   allowFullScreen ></iframe>
                <Cmap/>
            </div>
        </div>
    )
}